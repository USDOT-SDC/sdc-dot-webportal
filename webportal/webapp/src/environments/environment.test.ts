// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  STREAMING_URL: 'https://test-stream.sdc.dot.gov/guacamole/?authToken=',
  REGION: 'us-east-1',
  USER_POOL_ID: 'us-east-1_89P1HiXoV',
  CLIENT_ID: '341vdjpnjo7jel2tda2prtvvgf',
  IDENTITY_PROVIDER: 'USDOT-ADFS',
  APP_DOMAIN: 'test-sdc-dot-webportal',
  REDIRECT_URL: 'https://test-portal.securedatacommons.com/index.html',
  API_ENDPOINT: 'https://z2jk3bjo2m.execute-api.us-east-1.amazonaws.com/api/',
  LOGIN_GOV_COGNITO_APP_CLIENT_ID: '3fhjldmdh5rsjmck509u507qlu',
<<<<<<< HEAD
  ACCOUNT_LINK_URL: 'https://xf6y7x17bg.execute-api.us-east-1.amazonaws.com/test',
  LINK_ACCOUNT_PATH: 'test-link-account',
  ACCOUNT_LINKED_PATH: 'test-account-linked',
  RESET_TEMPORARY_PASSWORD_PATH: 'test-reset-temporary-password',
=======
  LOGIN_GOV_ACCOUNT_LINK_URL: 'https://xf6y7x17bg.execute-api.us-east-1.amazonaws.com',
>>>>>>> 7102614d7c0fe7af6c8a886aeaf3a257c5df8f8c
  ENVIRONMENT: 'test',
};
