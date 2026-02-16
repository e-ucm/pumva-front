/**
 * @fileoverview User session and client list management for the BFF application.
 * Manages user sessions, JWT tokens, and client connections for authenticated users.
 * 
 * Features:
 * - Session storage and retrieval
 * - JWT token management
 * - Client connection tracking
 * - Authentication refresh handling
 * - Session cleanup
 * 
 * @module libs/userClientsListManager
 * @requires ./logger
 * @requires jsonwebtoken
 * @requires ../routers/api
 * @author PUMVA Team
 */

import { logger } from "./logger";
import jwt from 'jsonwebtoken';
import { Session } from "../routers/api";

/**
 * Manages user sessions and client connections
 * @class UserClientsListManager
 */
export class UserClientsListManager {
    /**
     * Map of session IDs to arrays of client IDs
     * @type {Map<string, string[]>}
     */
    sessionClients: Map<string, string[]>;
    
    /**
     * Map of session IDs to session objects
     * @type {Map<string, Session>}
     */
    sessions: Map<string, Session>;

    /**
     * Creates a new UserClientsListManager instance
     * @constructor
     */
    constructor() {
        this.sessionClients = new Map();
        this.sessions = new Map();
    }

    /**
     * Adds a user session to the manager
     * @param {Session} session - The session object to add
     * @returns {void}
     */
    addUserSession(session : Session):void {
        var obj = session;
        if(obj.user && obj.user.jwt) {
            obj.user.sso = jwt.decode(obj.user.jwt);
        }
        this.sessions.set(session.id, obj);
        this.displaySessions();
    }

    /**
     * Displays all current sessions in the logger
     * @returns {void}
     */
    displaySessions(): void {
        logger.info("Sessions : {");
        for (let [sessionId, sessionData] of this.sessions) {
            logger.info("   " + sessionId + ":" + JSON.stringify(sessionData, null)+ ",");
        }
        logger.info("}");
    }

    /**
     * Gets the JWT token for a given session ID
     * @param {string} sessionId - The session ID to get the JWT for
     * @returns {string} The JWT token or undefined if not found
     */
    getJWT(sessionId: string): string {
        let result = this.sessions.get(sessionId);
        if(result && result.user && result.user.jwt) {
            return result.user.jwt;
        } else {
            return undefined as any;
        }
    }

    /**
     * Gets the session object for a given session ID
     * @param {string} sessionId - The session ID to get the session for
     * @returns {Session} The session object or undefined if not found
     */
    getSession(sessionId: string) : Session {
        let result = this.sessions.get(sessionId);
        if(result) {
            return result;
        } else {
            return undefined as any;
        }
    }

    /**
     * Refreshes authentication tokens for a session
     * @param {string} sessionId - The session ID to refresh auth for
     * @param {string} access_token - The new access token
     * @param {string} refresh_token - The new refresh token
     * @returns {void}
     */
    refreshAuth(sessionId: string, access_token: string, refresh_token: string) : void {
        var clientData = this.sessions.get(sessionId);
        if(clientData && clientData.user) {
            clientData.user.jwt = access_token;
            clientData.user.sso = jwt.decode(access_token);
            this.sessions.set(sessionId, clientData);
        }
    }

    /**
     * Gets a list of client IDs for sessions that need refresh
     * @param {string[]} sessions - Array of session IDs
     * @returns {string[]} Array of client IDs
     */
    getRefreshClientList(sessions: string[]) : string[] {
        let clientsToSend = [];
        for (let i = 0; i < sessions.length; i++) {
            let sessionId = sessions[i];
            var clients = this.sessionClients.get(sessionId);
            if(clients) {
                for(let j = 0; j < clients.length; j++) {
                    clientsToSend.push(clients[j]);
                }
            }
        }
        return clientsToSend;
    }

    /**
     * Removes a session and all associated clients
     * @param {string} sessionId - The session ID to remove
     * @returns {void}
     */
    removeSession(sessionId: string) : void {
        this.sessionClients.delete(sessionId);
        this.sessions.delete(sessionId);
        this.displayClients();
        this.displaySessions();
    }

    /**
     * Adds a client to a session
     * @param {string} sessionId - The session ID to add the client to
     * @param {string} clientId - The client ID to add
     * @returns {void}
     */
    addClient(sessionId: string, clientId: string) : void {
        var clients = this.sessionClients.get(sessionId);
        if(clients) {
            clients.push(clientId);
            this.sessionClients.set(sessionId, clients);
        } else {
            this.sessionClients.set(sessionId, [ clientId ]);
        }
        this.displayClients();
    }
    
    /**
     * Removes a specific client from a session
     * @param {string} sessionId - The session ID to remove the client from
     * @param {string} clientId - The client ID to remove
     * @returns {void}
     */
    removeClient(sessionId: string, clientId: string) : void {
        var clients = this.sessionClients.get(sessionId);
        if(clients) {
            var clientsFiltered = clients.filter(item => item !== clientId);
            if(clientsFiltered.length == 0) {
                this.sessionClients.delete(sessionId);
            } else {
                this.sessionClients.set(sessionId, clientsFiltered);
            }
        }
        this.displayClients();
    }

    /**
     * Displays all current client connections in the logger
     * @returns {void}
     */
    displayClients(): void {
        logger.info("Clients : {");
        for (let [sessionId, clientId] of this.sessionClients) {
            logger.info("   " + sessionId + ":" + clientId+ ",");
        }
        logger.info("}");
    }
}

/**
 * Singleton instance of UserClientsListManager
 * @type {UserClientsListManager}
 */
export default new UserClientsListManager();