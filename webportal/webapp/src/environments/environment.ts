// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  STREAMING_URL: 'https://dev-stream.securedatacommons.com/guacamole/?authToken=',
  REGION : 'us-east-1', // User pool AWS region
  USER_POOL_ID : 'us-east-1_Y5JI7ysvY' , // User pool ID
  CLIENT_ID : '207smrvtpcd6ucoup3s7ph0lb0', //p client ID
  IDENTITY_PROVIDER : 'USDOT-ADFS', // User pool Identity provider name
  APP_DOMAIN : 'dev-sdc-dot-webportal', // App domain name
  REDIRECT_URL : 'https://dev-portal.securedatacommons.com/index.html', // Re-direct URL for the user pool
  API_ENDPOINT : 'https://u2zksemc1h.execute-api.us-east-1.amazonaws.com/api/', // AWS API gateway base endpoint
  LOGIN_GOV_COGNITO_APP_CLIENT_ID: 'kfjfmaq0jvfjoq9gbt26c732o', // AWS Cognito client id
  LOGIN_GOV_ACCOUNT_LINK_URL: 'https://yr5qma7k4m.execute-api.us-east-1.amazonaws.com', // API endpoint for link-account
};
