// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  STREAMING_URL: 'https://dev-stream.securedatacommons.com/guacamole/?authToken=',
  REGION: 'us-east-1',
  USER_POOL_ID: 'us-east-1_Y5JI7ysvY',
  CLIENT_ID: '207smrvtpcd6ucoup3s7ph0lb0',
  IDENTITY_PROVIDER: 'USDOT-ADFS',
  APP_DOMAIN: 'dev-sdc-dot-webportal',
  // REDIRECT_URL: 'https://dev-portal.securedatacommons.com/index.html', //dev environment
  REDIRECT_URL: 'http://localhost:4200/index.html', // local development
  API_ENDPOINT: 'https://u2zksemc1h.execute-api.us-east-1.amazonaws.com/api/',
  LOGIN_GOV_COGNITO_APP_CLIENT_ID: '3ikuiqen3fdfl5brs5uk49cvsu',
  LOGIN_GOV_ACCOUNT_LINK_URL: 'https://dhclxz0yoa.execute-api.us-east-1.amazonaws.com',
  ENVIRONMENT: 'dev',
};
