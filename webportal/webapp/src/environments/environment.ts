// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: '',
  STREAMING_URL: '',
  REGION : '', // User pool AWS region
  USER_POOL_ID : '' , // User pool ID
  CLIENT_ID : '', //p client ID
  IDENTITY_PROVIDER : '', // User pool Identity provider name
  APP_DOMAIN : '', // App domain name
  REDIRECT_URL : '', // Re-direct URL for the user pool
  API_ENDPOINT : '', // AWS API gateway base endpoint
  LOGIN_GOV_COGNITO_APP_CLIENT_ID: '' // AWS Cognito client id
};
