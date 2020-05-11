// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  STREAMING_URL: 'https://dev-stream.securedatacommons.com/guacamole/?authToken=',
  REGION: 'us-east-1',
  USER_POOL_ID: 'us-east-1_Y5JI7ysvY',
  CLIENT_ID: '7apdoeuudp6606blne6cstpneu',
  IDENTITY_PROVIDER: 'dev-dot-ad',
  APP_DOMAIN: 'dev-sdc-dot-webportal',
  REDIRECT_URL: 'https://dev-portal.securedatacommons.com/index.html', //dev environment
  // REDIRECT_URL: 'http://localhost:4200/index.html', // local development
  API_ENDPOINT: 'https://u2zksemc1h.execute-api.us-east-1.amazonaws.com/api/',
  LOGIN_GOV_COGNITO_APP_CLIENT_ID: '3ikuiqen3fdfl5brs5uk49cvsu',
  ACCOUNT_LINK_URL: 'https://dhclxz0yoa.execute-api.us-east-1.amazonaws.com/dev',
  LINK_ACCOUNT_PATH: 'dev-link-account',
  ACCOUNT_LINKED_PATH: 'dev-account-linked'
};
