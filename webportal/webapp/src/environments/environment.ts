// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: '',
  STREAMING_URL: '',
  REGION : 'us-east-1', // User pool AWS region
  USER_POOL_ID : 'us-east-1_Y5JI7ysvY' , // User pool ID
  CLIENT_ID : '207smrvtpcd6ucoup3s7ph0lb0', //p client ID
  IDENTITY_PROVIDER : '', // User pool Identity provider name
  APP_DOMAIN : 'dev-sdc-dot-webportal', // App domain name
  REDIRECT_URL : 'http://localhost:4200/index.html', // Re-direct URL for the user pool
  API_ENDPOINT : ''// AWS API gateway base endpoint
};

