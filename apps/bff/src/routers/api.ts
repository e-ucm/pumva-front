import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { Session as ExpressSession } from 'express-session';
import passport from 'passport';
// @ts-ignore
import { Strategy as KeyCloakStrategy } from 'passport-keycloak-oauth2-oidc';
import config from '../config';
import { logger } from "../libs/logger";
import userClientsListManager from '../libs/userClientsListManager';

interface User {
  sso?: any;
  sql?: any;
  jwt?: string;
  refreshToken?: string;
}

export interface Session extends ExpressSession {
    user?: User;
    intendedUrl?: string;
}

export interface AuthenticatedRequest extends Request {
  session: Session;
}

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
 
 let keycloakConfig = {
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

const router = Router();

router.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from BFF" });
});

router.get('/ssoconnect', (req: Request, res: Response, next: any) => {
  passport.authenticate('openid', {})(req, res, next);
});

router.get('/openid/return', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('openid', { failureRedirect: '/ssoconnect' }, (err : Error, user : User) => {
      logger.info('/openid/return: USER');
      if(err){
        logger.error(err);
        return res.redirect('/ssoconnect');
      }
      const authReq = req as unknown as AuthenticatedRequest;
      logger.info(user);
      logger.info(authReq.session);
      authReq.session.user={};
      authReq.session.user.sso = user.sso;
      authReq.session.user.jwt = user.jwt;
      authReq.session.user.refreshToken = user.refreshToken;
      let session = authReq.session;
      session.user = user;
      logger.info(user);
      const intendedUrl = authReq.session.intendedUrl || '/';
      delete authReq.session.intendedUrl;
      logger.info(session);
      userClientsListManager.addUserSession(session);
      logger.info(authReq.session);
      res.redirect(intendedUrl);
    })(req, res, next);
});

export default router;