import * as Utils from './utils';
import config from '../config';
import userClientsListManager from './userClientsListManager';
import * as usertools from './usertools';
export class Pumva {
	apiurl;
	ssoUrl;
	ssoRealm;
	shlinkapikey;
	shlinkapidomain;
	shlinkapiurl;

	constructor() {
		this.apiurl= config.api.url;
		this.ssoUrl = config.sso.url;
		this.ssoRealm = config.sso.realm;	
		this.shlinkapikey = config.shlink.apikey;
		this.shlinkapidomain = config.shlink.apihost;
		this.shlinkapiurl = config.shlink.apiurl;
	}

	// REQUEST
	post(url : string, body : any, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.post(url, body, callback, userClientsListManager.getJWT(sessionId));
			}
		});
		
	}

	patch(url : string, body : any, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.patch(url, body, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	put(url : string, body : any, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.put(url, body, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	get(url : string, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.get(url, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	delete(url : string, sessionId : string, callback : Function){
		usertools.authExpiredAndRefreshAuthWithCallback(userClientsListManager.getSession(sessionId), (error : any, result : any) => {
			if(!error) {
				Utils.del(url, callback, userClientsListManager.getJWT(sessionId));
			}
		});
	}

	//SHLINK URL
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

	//SHLINK URL
	deleteShLink(shortCode : string, callback : Function){
		Utils.del(`${this.shlinkapiurl}/rest/v3/short-urls/${shortCode}?domain=${this.shlinkapidomain}`, callback, undefined, this.shlinkapikey);
	}

	// USER
	setRole(username : string, role: string, sessionId: string, callback: Function){
		let body = { username: username, role: role };
		this.patch(`${this.apiurl}/users/${username}`, body, sessionId, callback);
	}

	getCurrentUser(sessionId: string, callback: Function){
		this.get(`${this.apiurl}/users/me`, sessionId, callback);
	}

	fetchGames(userId: number, sessionId: string, callback: Function) {
		this.get(`${this.apiurl}/views/games/user/${userId}`, sessionId, callback);
	}

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

	fetchVersions(gameId: number, sessionId: string, callback: Function) {
		this.get(`${this.apiurl}/games/${gameId}/versions`, sessionId, callback);
	}
	
	deleteVersion(gameId: number, versionId: number, sessionId: string, callback: Function)
	{
		this.delete(`${this.apiurl}/games/${gameId}/versions/${versionId}`, sessionId, callback);
	}

	fetchGuides(gameId: number, sessionId: string, callback: Function)
	{
		this.get(`${this.apiurl}/games/${gameId}/guides`, sessionId, callback);
	}

	addGuide(gameId: number, guide: any, sessionId: string, callback: Function)
	{
		this.post(`${this.apiurl}/games/${gameId}/guides`, guide, sessionId, callback);
	}

	removeGuide(gameId: number, guideId: number, sessionId: string, callback: Function)
	{
		this.delete(`${this.apiurl}/games/${gameId}/guides/${guideId}`, sessionId, callback);
	}

	fetchPermissions(gameId: number, sessionId: string, callback: Function)
	{
		this.get(`${this.apiurl}/games/${gameId}/permissions`, sessionId, callback);
	}

	addPermission(gameId: number, payload: any, sessionId: string, callback: Function)
	{
		this.post(`${this.apiurl}/games/${gameId}/permissions`, payload, sessionId, callback);
	}

	removePermission(gameId: number, permissionId: number, sessionId: string, callback: Function)
	{
		this.delete(`${this.apiurl}/games/${gameId}/permissions/${permissionId}`, sessionId, callback);
	}

	fetchSessions(gameId: number, sessionId: string, callback: Function)
	{
		this.get(`${this.apiurl}/games/${gameId}/sessions`, sessionId, callback);
	}
}

export default new Pumva();