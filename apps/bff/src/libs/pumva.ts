/**
 * @fileoverview Main API client for PUMVA backend services.
 * Provides authenticated HTTP methods and specific API endpoints for games, users, 
 * permissions, guides, and URL shortening services.
 * 
 * Features:
 * - Authenticated HTTP requests with automatic token refresh
 * - Game management (CRUD operations)
 * - User management and role setting
 * - Permission and guide management
 * - URL shortening integration with Shlink
 * 
 * @module libs/pumva
 * @requires ./utils
 * @requires ../config
 * @requires ./userClientsListManager
 * @requires ./usertools
 * @author PUMVA Team
 */

import * as Utils from './utils';
import config from '../config';
import userClientsListManager from './userClientsListManager';
import * as usertools from './usertools';

/**
 * Main API client class for PUMVA backend services
 * @class Pumva
 */
export class Pumva {
	/**
	 * PUMVA API base URL
	 * @type {string}
	 */
	apiurl;
	
	/**
	 * SSO base URL
	 * @type {string}
	 */
	ssoUrl;
	
	/**
	 * SSO realm name
	 * @type {string}
	 */
	ssoRealm;
	
	/**
	 * Shlink API key
	 * @type {string}
	 */
	shlinkapikey;
	
	/**
	 * Shlink API domain
	 * @type {string}
	 */
	shlinkapidomain;
	
	/**
	 * Shlink API base URL
	 * @type {string}
	 */
	shlinkapiurl;

	/**
	 * Creates a new Pumva API client instance
	 * Initializes configuration from the config module
	 * @constructor
	 */
	constructor() {
		this.apiurl= config.api.url;
		this.ssoUrl = config.sso.url;
		this.ssoRealm = config.sso.realm;	
		this.shlinkapikey = config.shlink.apikey;
		this.shlinkapidomain = config.shlink.apihost;
		this.shlinkapiurl = config.shlink.apiurl;
	}

	/**
	 * Makes an authenticated POST request with automatic token refresh
	 * @param {string} url - The URL to make the request to
	 * @param {any} body - The request body data
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, data)
	 * @returns {void}
	 */
	post(url : string, body : any, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.post(url, body, callback, userClientsListManager.getJWT(sessionId));
			}
		});
		
	}

	/**
	 * Makes an authenticated PATCH request with automatic token refresh
	 * @param {string} url - The URL to make the request to
	 * @param {any} body - The request body data
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, data)
	 * @returns {void}
	 */
	patch(url : string, body : any, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.patch(url, body, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	/**
	 * Makes an authenticated PUT request with automatic token refresh
	 * @param {string} url - The URL to make the request to
	 * @param {any} body - The request body data
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, data)
	 * @returns {void}
	 */
	put(url : string, body : any, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.put(url, body, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	/**
	 * Makes an authenticated GET request with automatic token refresh
	 * @param {string} url - The URL to make the request to
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, data)
	 * @returns {void}
	 */
	get(url : string, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.get(url, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	/**
	 * Makes an authenticated DELETE request with automatic token refresh
	 * @param {string} url - The URL to make the request to
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, data)
	 * @returns {void}
	 */
	delete(url : string, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.del(url, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	/**
	 * Generates a shortened URL using Shlink service
	 * @param {string} url - The long URL to shorten
	 * @param {string} tag - Tag to associate with the short URL
	 * @param {string} title - Title for the short URL
	 * @param {Function} callback - Callback function (error, data)
	 * @param {string} [customSlug] - Optional custom slug for the short URL
	 * @param {number} [length] - Optional length for the short code
	 * @returns {void}
	 */
	generateURL(url : string, tag : string, title : string, callback : Function, customSlug? : string, length? : number){
		let body : any = {
			"longUrl": url,
			"tags": [
			  tag
			],
			//"validSince": "string",
			//"validUntil": "string",
			//"maxvisits": 0,
			"title": title,
			"crawlable": false,
			"forwardQuery": true,
			"findIfExists": true,
			"domain": `${this.shlinkapidomain}`,
			//"customSlug": null,
			//"shortCodeLength": 0
		}
		if(length) {
			body.shortCodeLength = length;
		}
		if(customSlug) {
			body.customSlug = customSlug;
		}
		Utils.post(`${this.shlinkapiurl}/rest/v3/short-urls`, body, callback, undefined, this.shlinkapikey);
	}

	/**
	 * Deletes a shortened URL from Shlink service
	 * @param {string} shortCode - The short code to delete
	 * @param {Function} callback - Callback function (error, data)
	 * @returns {void}
	 */
	deleteShLink(shortCode : string, callback : Function){
		Utils.del(`${this.shlinkapiurl}/rest/v3/short-urls/${shortCode}?domain=${this.shlinkapidomain}`, callback, undefined, this.shlinkapikey);
	}

	/**
	 * Sets a user's role in the system
	 * @param {string} username - The username to update
	 * @param {string} role - The new role to assign
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, data)
	 * @returns {void}
	 */
	setRole(username : string, role: string, sessionId: string, callback: Function){
		let body = { username: username, role: role };
		this.patch(`${this.apiurl}/users/${username}`, body, sessionId, callback);
	}

	/**
	 * Gets the current user's profile information
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, user)
	 * @returns {void}
	 */
	getCurrentUser(sessionId: string, callback: Function){
		this.get(`${this.apiurl}/users/me`, sessionId, callback);
	}

	/**
	 * Fetches all games for a specific user
	 * @param {number} userId - The user ID to fetch games for
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, games[])
	 * @returns {void}
	 */
	fetchGames(userId: number, sessionId: string, callback: Function) {
		this.get(`${this.apiurl}/views/games/user/${userId}`, sessionId, callback);
	}

	/**
	 * Fetches a specific game for a user by game ID
	 * @param {number} userId - The user ID to fetch the game for
	 * @param {string|number} gameId - The game ID to fetch
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, game)
	 * @returns {void}
	 */
	fetchGame(userId: number, gameId: string | number, sessionId: string, callback: Function) {
		this.get(`${this.apiurl}/views/games/user/${userId}`, sessionId, (err: any, games: any[]) => {
			if (err) {
				return callback(err);
			}
			const game = games.find((g) => g.game_id == gameId);
			callback(null, game);
			}
		)
	}

	/**
	 * Fetches all versions of a specific game
	 * @param {number} gameId - The game ID to fetch versions for
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, versions[])
	 * @returns {void}
	 */
	fetchVersions(gameId: number, sessionId: string, callback: Function) {
		this.get(`${this.apiurl}/games/${gameId}/versions`, sessionId, callback);
	}
	
	/**
	 * Deletes a specific version of a game
	 * @param {number} gameId - The game ID
	 * @param {number} versionId - The version ID to delete
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, result)
	 * @returns {void}
	 */
	deleteVersion(gameId: number, versionId: number, sessionId: string, callback: Function)
	{
		this.delete(`${this.apiurl}/games/${gameId}/versions/${versionId}`, sessionId, callback);
	}

	/**
	 * Fetches all guides for a specific game
	 * @param {number} gameId - The game ID to fetch guides for
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, guides[])
	 * @returns {void}
	 */
	fetchGuides(gameId: number, sessionId: string, callback: Function)
	{
		this.get(`${this.apiurl}/games/${gameId}/guides`, sessionId, callback);
	}

	/**
	 * Adds a new guide to a game
	 * @param {number} gameId - The game ID to add the guide to
	 * @param {any} guide - The guide data to add
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, newGuide)
	 * @returns {void}
	 */
	addGuide(gameId: number, guide: any, sessionId: string, callback: Function)
	{
		this.post(`${this.apiurl}/games/${gameId}/guides`, guide, sessionId, callback);
	}

	/**
	 * Removes a guide from a game
	 * @param {number} gameId - The game ID to remove the guide from
	 * @param {number} guideId - The guide ID to remove
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, result)
	 * @returns {void}
	 */
	removeGuide(gameId: number, guideId: number, sessionId: string, callback: Function)
	{
		this.delete(`${this.apiurl}/games/${gameId}/guides/${guideId}`, sessionId, callback);
	}

	/**
	 * Fetches all permissions for a specific game
	 * @param {number} gameId - The game ID to fetch permissions for
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, permissions[])
	 * @returns {void}
	 */
	fetchPermissions(gameId: number, sessionId: string, callback: Function)
	{
		this.get(`${this.apiurl}/games/${gameId}/permissions`, sessionId, callback);
	}

	/**
	 * Adds a new permission to a game
	 * @param {number} gameId - The game ID to add the permission to
	 * @param {any} payload - The permission data to add
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, newPermission)
	 * @returns {void}
	 */
	addPermission(gameId: number, payload: any, sessionId: string, callback: Function)
	{
		this.post(`${this.apiurl}/games/${gameId}/permissions`, payload, sessionId, callback);
	}

	/**
	 * Removes a permission from a game
	 * @param {number} gameId - The game ID to remove the permission from
	 * @param {number} permissionId - The permission ID to remove
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, result)
	 * @returns {void}
	 */
	removePermission(gameId: number, permissionId: number, sessionId: string, callback: Function)
	{
		this.delete(`${this.apiurl}/games/${gameId}/permissions/${permissionId}`, sessionId, callback);
	}

	/**
	 * Fetches all sessions for a specific game
	 * @param {number} gameId - The game ID to fetch sessions for
	 * @param {string} sessionId - The session ID for authentication
	 * @param {Function} callback - Callback function (error, sessions[])
	 * @returns {void}
	 */
	fetchSessions(gameId: number, sessionId: string, callback: Function)
	{
		this.get(`${this.apiurl}/games/${gameId}/sessions`, sessionId, callback);
	}
}

/**
 * Singleton instance of the Pumva API client
 * @type {Pumva}
 */
export default new Pumva();