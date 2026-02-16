/**
 * @fileoverview User authentication and session management utilities.
 * Provides functions for authentication, session handling, JWT operations,
 * and frontend integration for the BFF application.
 * 
 * Features:
 * - Authentication status checking and token refresh
 * - Frontend routing and redirection
 * - JWT token handling and validation  
 * - Session management and cleanup
 * - SSO authentication flow
 * 
 * @module libs/usertools
 * @requires express
 * @requires jsonwebtoken
 * @requires axios
 * @requires ./logger
 * @requires ../config
 * @author PUMVA Team
 */

import { NextFunction, Response } from "express";
import { Session , AuthenticatedRequest } from "../routers/api";

import jwt from 'jsonwebtoken';
import axios from 'axios';
import { logger } from './logger';
import config from '../config';
import userClientsListManager from "./userClientsListManager";
import path from "path";

/**
 * Generates URL prefix with appropriate number of '../' for navigation
 * @param {number} [level=0] - Directory depth level
 * @returns {string} URL prefix with appropriate relative path
 */
export function preTabs(level = 0): string {
	var pre = '/';
	for(var i = 0; i < level; i++){
	  pre += '../';
	}
	return pre;
}

/**
 * Redirects to the frontend SPA index.html file
 * @param {AuthenticatedRequest} req - Express request object with session
 * @param {Response} res - Express response object
 * @returns {void}
 */
export function redirectToFrontend(req: AuthenticatedRequest, res: Response): void {
	logger.info(`redirectToFrontend() - Redirecting to frontend for URL: ${req.originalUrl}`);
	logger.info(config.frontendPath);
	return res.sendFile(path.join(config.frontendPath, "index.html"));
}

/**
 * Gets a list of session IDs that need authentication refresh
 * @returns {Promise<string[]>} Promise resolving to array of session IDs
 */
export async function getRefreshSessionsList() : Promise<string[]> {
     let sessionsToSend = [];
     for (let [sessionId, sessionData] of userClientsListManager.sessions) {
         let ok = await isAuthExpiredPromise(sessionData);
         if(ok) {
             sessionsToSend.push(ok);
         }
     }
     return sessionsToSend;
 }

 /**
  * Promise wrapper for authentication expiration check
  * @param {any} session - The session object to check
  * @returns {Promise<string|null>} Promise resolving to session ID if expired, null otherwise
  */
 export async function isAuthExpiredPromise(session : any) : Promise<string | null> {
     return new Promise((resolve, reject) => {
         isAuthExpired(session, (error: Error, result: any) => {
             if(error) {
                 reject(error);
             } else {
                 if(result.type == "expired") {
                     resolve(session.id);
                 }
             }
         });
     });
 }

 /**
  * Checks authentication expiration and refreshes tokens with callback
  * @param {any} session - The session object to check and refresh
  * @param {Function} callback - Callback function (error, result)
  * @returns {void}
  */
 export function authExpiredAndRefreshAuthWithCallback(session: any, callback: any): void {
     authExpired(session, config, (error: Error, result: any) => {
         if(error) {
             logger.info(JSON.stringify(error));
			if(session && session.id) {
          	   userClientsListManager.removeSession(session.id);
			}
             callback(error);
         } else {
             if(result) {
                 logger.info(JSON.stringify(result));
                 userClientsListManager.refreshAuth(session.id, result.access_token, result.refresh_token);
                 logger.info("Auth Refreshed");
                 callback(null, {message:"Auth Refreshed"});
             } else {
                 callback(null, {message:"Auth OK"});
             }
         }
     });
 }

/**
 * Sets user information in the session from JWT token
 * @param {AuthenticatedRequest} req - Express request object with session
 * @param {any} user - User object containing JWT token
 * @returns {void}
 */
export function setUser(req: AuthenticatedRequest, user: any): void {
	let decoded = jwt.decode(user.jwt) as any;
	logger.info(`JWT : ${JSON.stringify(decoded)}`);
	if (req.session?.user?.sso && decoded) {
		req.session.user.sso.roles = decoded.realm_access.roles;
		req.session.user.sso.role = getRoleFromJWT(decoded);
	}
}

/**
 * Checks if authentication token is expired
 * @param {Session} session - The session object to check
 * @param {Function} callback - Callback function (error, result)
 * @returns {void}
 */
export function isAuthExpired(session: Session, callback: any): void {
	try {
		if (!session?.user?.jwt) {
			callback({
				status: 500,
				data: {
					message: 'Unable to parse accessToken',
					error: 'Missing user or jwt token'
				}
			});
			return;
		}
		let current = Math.floor(Date.now() / 1000);
		let jwtdecoded = decodeJWT(session.user.jwt);
		let expiration = parseInt(jwtdecoded.exp);
		if(current > expiration){
			logger.info(`authExpired() - JWT: ${JSON.stringify(jwtdecoded)}`);
			logger.info(`authExpired() - Expiration: ${expiration}`);
			logger.info("authExpired() - Token Expired");
			callback(null, {type:"expired"});
		}else{
			logger.debug("authExpired() - Token OK");
			callback(null, {type:"ok"});
		}
	} catch(e) {
		callback({
			status: 500,
			data: {
				message: 'Unable to parse accessToken',
				error: e
			}
		});
	}
}

/**
 * Checks authentication expiration and handles refresh if needed
 * @param {any} session - The session object to check
 * @param {any} config - Configuration object
 * @param {Function} callback - Callback function (error, result)
 * @returns {void}
 */
export function authExpired(session: any, config: any, callback: any): void {
	isAuthExpired(session, (error: Error, result: any) => {
		if(error) {
			callback(error);
		} else {
			if(result.type == "expired") {
				refreshAuth(session, config, callback);
			} else {
				callback();
			}
		}
	});
}

/**
 * Decodes a JWT token
 * @param {string} token - The JWT token to decode
 * @returns {any} Decoded token payload
 */
export function decodeJWT(token: string): any {
	return jwt.decode(token);
}

/**
 * Extracts user profile information from JWT token
 * @param {string} token - The JWT token to extract profile from
 * @returns {any} User profile object
 */
export function getProfileFromJWT(token: string): any {
	let profile : any = {};
	let simvaJwtToken = decodeJWT(token);
	logger.info(`getProfileFromJWT() : ${JSON.stringify(simvaJwtToken)}`);
	profile.provider = simvaJwtToken.iss;
	profile.id = simvaJwtToken.data.id;
	profile.username = simvaJwtToken.data.username;
	profile.email = simvaJwtToken.email;
	profile.roles = simvaJwtToken.realm_access.roles;
	profile.role = getRoleFromJWT(simvaJwtToken);
	return profile;
}

/**
 * Determines user role from decoded JWT token
 * @param {any} decoded - Decoded JWT token object
 * @returns {string} User role (teacher, student, norole)
 */
export function getRoleFromJWT(decoded: any) : string {
	let role = 'norole';
	if(decoded.realm_access.roles.includes('teacher') || decoded.realm_access.roles.includes('researcher')){
		role = 'teacher';
	} else if(decoded.realm_access.roles.includes('teaching-assistant') || decoded.realm_access.roles.includes('student')){
		role = 'student';
	};
	return role;
}

/**
 * Refreshes authentication tokens using refresh token
 * @param {Session} session - The session object containing refresh token
 * @param {any} config - Configuration object with SSO settings
 * @param {Function} callback - Callback function (error, response)
 * @returns {void}
 */
export function refreshAuth(session: Session, config: any, callback: any) : void {
	if(session.user && session.user.refreshToken){
		logger.info(`refreshAuth() - Refresh Token : ${session.user.refreshToken}`);
		const clientConfig= `${config.sso.clientId}:${config.sso.clientSecret}`;
		const querystring = new URLSearchParams({
			'grant_type': 'refresh_token',
			'refresh_token': session.user.refreshToken
		  });
		axios.post(`${config.sso.url}/realms/${config.sso.realm}/protocol/openid-connect/token`, querystring, {
			headers: {
			  'Authorization': `Basic ${Buffer.from(clientConfig).toString('base64')}`,
			  'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then((response: any) => {
			try {
				let simvaToken = response.data.access_token;
				let simvaRefreshToken = response.data.refresh_token;
				logger.debug(`refreshAuth() - Access Token : ${simvaToken}`);
				logger.debug(`refreshAuth() - Refresh Token : ${simvaRefreshToken}`);
				if(simvaToken == "undefined" || simvaToken == null) {
					callback({
						status: 500,
						data: {
							message: 'Token not active.',
							error: response.data
						}
					});
				} else {
					callback(null, response.data);
				}
			} catch(e) {
				logger.info(e);
				callback({
					status: 500,
					data: {
						message: 'Unable to refresh accessToken',
						error: e
					}
				});
			}
		})
		.catch((error : Error) => {
			callback({
				status: 500,
				data: {
					message: 'Unable to refresh accessToken',
					error: error
				}
			});
		});
	}else{
		callback({
			status: 401,
			data: {
				message: 'No user or refreshToken'
			}
		});
	}
}