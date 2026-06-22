// src/authConfig.js
export const authConfig = {
    clientId: 'oauth2-demo-pkce',
    authorizationEndpoint: 'http://localhost:8181/realms/demotry/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8181/realms/demotry/protocol/openid-connect/token',
    redirectUri: 'http://localhost:5173',  // Ensure this matches Keycloak settings
    scope: 'openid profile email offline_access',
    onRefreshTokenExpire: (event) => event.logIn(),  // Handle token expiration
  };
  