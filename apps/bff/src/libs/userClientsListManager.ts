import { logger } from "./logger";
import jwt from 'jsonwebtoken';
import { Session } from "../routers/api";

export class UserClientsListManager {
    sessionClients: Map<string, string[]>;
    sessions: Map<string, Session>;

    constructor() {
        this.sessionClients = new Map();
        this.sessions = new Map();
    }

    addUserSession(session : Session):void {
        var obj = session;
        if(obj.user && obj.user.jwt) {
            obj.user.sso = jwt.decode(obj.user.jwt);
        }
        this.sessions.set(session.id, obj);
        this.displaySessions();
    }

    displaySessions(): void {
        logger.info("Sessions : {");
        for (let [sessionId, sessionData] of this.sessions) {
            logger.info("   " + sessionId + ":" + JSON.stringify(sessionData, null)+ ",");
        }
        logger.info("}");
    }

    getJWT(sessionId: string): string {
        let result = this.sessions.get(sessionId);
        if(result && result.user && result.user.jwt) {
            return result.user.jwt;
        } else {
            return undefined as any;
        }
    }

    getSession(sessionId: string) : Session {
        let result = this.sessions.get(sessionId);
        if(result) {
            return result;
        } else {
            return undefined as any;
        }
    }

    refreshAuth(sessionId: string, access_token: string, refresh_token: string) : void {
        var clientData = this.sessions.get(sessionId);
        if(clientData && clientData.user) {
            clientData.user.jwt = access_token;
            clientData.user.sso = jwt.decode(access_token);
            this.sessions.set(sessionId, clientData);
        }
    }

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

    removeSession(sessionId: string) : void {
        this.sessionClients.delete(sessionId);
        this.sessions.delete(sessionId);
        this.displayClients();
        this.displaySessions();
    }

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

    displayClients(): void {
        logger.info("Clients : {");
        for (let [sessionId, clientId] of this.sessionClients) {
            logger.info("   " + sessionId + ":" + clientId+ ",");
        }
        logger.info("}");
    }
}

export default new UserClientsListManager();