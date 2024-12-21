import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from '../environments/environment.prod';


export const b2cPolicies = {
  names: {
    signUpSignIn: environment.signUpSignInPolicy
  },
  authorities: {
    signUpSignIn: {
      authority: environment.authority
    }
  },
  authorityDomain: environment.authorityDomain
};


export const msalConfig: Configuration = {
  auth: {
    clientId: environment.clientId,
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: '/',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        //console.log(message);
      },

      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    },
    allowNativeBroker: false
  }
}

export const protectedResources = {
  DaApi: {
    endpoint: environment.endpoint,
    scopes: [environment.scope],
  },
}
export const loginRequest = {
  scopes: []
};
