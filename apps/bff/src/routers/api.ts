/**
 * @fileoverview API router for authentication and SSO integration.
 * Handles Keycloak authentication, session management, and user authentication status.
 * 
 * Features:
 * - Keycloak passport strategy configuration
 * - SSO authentication endpoints
 * - User authentication status checking
 * - Session management with JWT tokens
 * - Route protection middleware
 * 
 * @module routers/api
 * @requires express
 * @requires passport
 * @requires passport-keycloak-oauth2-oidc
 * @author PUMVA Team
 */

import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { Session as ExpressSession } from 'express-session';
import passport from 'passport';
// @ts-ignore
import { Strategy as KeyCloakStrategy } from 'passport-keycloak-oauth2-oidc';
import config from '../config';
import { logger } from "../libs/logger";
import userClientsListManager from '../libs/userClientsListManager';
import axios from "axios";
import * as usertools from "../libs/usertools";
import pumvaAsync from "../libs/pumvaAsync";

/**
 * User interface for session management
 * @interface User
 * @property {any} [sso] - SSO user data
 * @property {any} [sql] - Database user data
 * @property {string} [jwt] - JWT token
 * @property {string} [refreshToken] - Refresh token
 */
export interface User {
  sso?: any;
  sql?: any;
  jwt?: string;
  refreshToken?: string;
}

/**
 * Extended session interface with user and intended URL
 * @interface Session
 * @extends ExpressSession
 * @property {User} [user] - User object
 * @property {string} [intendedUrl] - URL to redirect to after authentication
 */
export interface Session extends ExpressSession {
    user?: User;
    intendedUrl?: string;
}

/**
 * Extended request interface for authenticated routes
 * @interface AuthenticatedRequest
 * @extends Request
 * @property {Session} session - Session with user data
 */
export interface AuthenticatedRequest extends Request {
  session: Session;
}

/**
 * Custom Keycloak strategy extending the base strategy
 * @class SimvaKeyCloakStrategy
 * @extends KeyCloakStrategy
 */
class SimvaKeyCloakStrategy extends KeyCloakStrategy {
   constructor(options: any, verify: any) {
     super(options, verify);
   }

   authorizationParams(options: any) {
     const params = super.authorizationParams(options as any);
     if ('simva_user_token' in options) {
       params.simva_user_token = options.simva_user_token;
      }
     if ('login_hint' in options) {
       params.login_hint = options.login_hint;
     }
     if ('hideLocaleDropdown' in options) {
       params.hideLocaleDropdown = options.hideLocaleDropdown;
     }
     if ('ui_locales' in options) {
       params.ui_locales = options.ui_locales;
     }
     return params;
   }

   authenticate(req: any, options?: any) {
    return super.authenticate(req, options as any);
   }
 }
 /**
 * Keycloak configuration object for the SSO strategy
 * @type {Object}
 */ let keycloakConfig = {
   clientID: config.sso.client_id,
   realm: config.sso.realm,
   publicClient: config.sso.public_client,
   clientSecret: config.sso.client_secret,
   sslRequired: config.sso.ssl_required,
   scope: "openid profile email roles",
   authServerURL: config.sso.url,
   callbackURL: `${config.external_url}/api/openid/return`
 };

 console.info('--- SSO CONFIG ---');
 console.info(keycloakConfig);
 console.info('------------------');
 passport.use('openid', new SimvaKeyCloakStrategy(keycloakConfig, (accessToken: string, refreshToken: string, profile: any, done: any) => {
     const user: User = {};
     user.sso = profile;
     user.jwt = accessToken;
     user.refreshToken = refreshToken;
     done(null, user);
   })
 );

/**
 * Express router instance for API endpoints
 * @type {Router}
 */
const router = Router();

/**
 * Health check endpoint
 * @name GET /hello
 * @function
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} JSON response with hello message
 */
router.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from BFF" });
});

/**
 * SSO connection endpoint - initiates Keycloak authentication
 * @name GET /ssoconnect
 * @function
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
router.get('/ssoconnect', (req: Request, res: Response, next: any) => {
  passport.authenticate('openid', {})(req, res, next);
});

/**
 * Authentication status check endpoint
 * @name GET /isAuthenticated
 * @function
 * @param {AuthenticatedRequest} req - Express request object with session
 * @param {Response} res - Express response object
 * @returns {Object} JSON response with authentication status
 */
router.get('/isAuthenticated', (req: AuthenticatedRequest, res: Response) => {
  if (req.session && req.session.user && req.session.user.jwt) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

/**
 * OpenID Connect callback endpoint - handles authentication response from Keycloak
 * Sets up user session and redirects to intended URL
 * @name GET /openid/return
 * @function
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
router.get('/openid/return', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('openid', { failureRedirect: '/ssoconnect' }, async (err : Error, user : User) => {
      logger.info('/openid/return: USER');
      if(err){
        logger.error(err);
        return res.redirect('/ssoconnect');
      }
      const authReq = req as unknown as AuthenticatedRequest;
      logger.info(user);
      logger.info(authReq.session);
      authReq.session.user={};
      authReq.session.user.jwt = user.jwt;
      authReq.session.user.refreshToken = user.refreshToken;
      authReq.session.user.sso = user.sso;
      let session = authReq.session;
      logger.info(user);
      const intendedUrl = authReq.session.intendedUrl || '/';
      delete authReq.session.intendedUrl;
      logger.info(session);
      userClientsListManager.addUserSession(session);
      authReq.session.user.sql = await pumvaAsync.getCurrentUser(req.session.id);
      logger.info(authReq.session);
      res.redirect(intendedUrl);
    })(req, res, next);
});

/**
 * User logout endpoint
 * Logs out the user from Keycloak and clears session data
 * @name GET /logout
 * @function
 * @param {AuthenticatedRequest} req - Express request object with session
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
router.get('/logout', function(req : AuthenticatedRequest, res : Response, next : NextFunction){
    let sessionId = req.session.id;
    if(req.session && req.session.user && req.session.user.refreshToken){
      let clientConfig= `${config.sso.client_id}:${config.sso.client_secret}`
      const querystring = new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': req.session.user.refreshToken
      });
      axios.post(`${config.sso.url}/realms/${config.sso.realm}/protocol/openid-connect/logout`, querystring, {
          headers: {
            'Authorization': `Basic ${Buffer.from(clientConfig).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      })
      .then((response : any) => {
        userClientsListManager.removeSession(sessionId);
        req.session.user = undefined;
        res.redirect('/login');
      })
      .catch((error : any) => {
        logger.error(error);
        res.redirect('/login');
      })
    }else{
      userClientsListManager.removeSession(sessionId);
      req.session.user = undefined;
      res.redirect('/login');
    }
  });

  /**
 * Authentication token refresh endpoint
 * Refreshes expired authentication tokens using refresh token
 * @name GET /refresh_auth
 * @function
 * @param {AuthenticatedRequest} req - Express request object with session
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
router.get('/refresh_auth', function (req : AuthenticatedRequest, res : Response, next : NextFunction) {
    usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(req.session.id), function(error : any, result : any) {
      if(error){
        res.redirect("/login");
      }else{
        logger.debug("auth() - Token OK");
        res.send(result);
        //return next();
      }
    });
  });

/**
 * Export the configured router with all authentication routes
 * @type {Router}
 */
export default router;