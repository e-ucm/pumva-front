import passport from 'passport';
// @ts-ignore
import { Strategy as KeyCloakStrategy } from 'passport-keycloak-oauth2-oidc';
import config from '../config';

interface User {
  data?: any;
  jwt?: string;
  refreshToken?: string;
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
   clientID: config.sso.clientId,
   realm: config.sso.realm,
   publicClient: config.sso.publicClient,
   clientSecret: config.sso.clientSecret,
   sslRequired: config.sso.sslRequired,
   scope: "openid profile email roles",
   authServerURL: config.sso.url,
   callbackURL: `${config.simva.url}/users/openid/return`
 }
 console.info('--- SSO CONFIG ---');
 console.info(keycloakConfig);
 console.info('------------------');
 passport.use('openid', new SimvaKeyCloakStrategy(keycloakConfig, (accessToken: string, refreshToken: string, profile: any, done: any) => {
     const user: User = {};
     user.data = profile;
     user.jwt = accessToken;
     user.refreshToken = refreshToken;
     done(null, user);
   })
 );


 
export default passport;
