import { Injectable, Inject } from "@angular/core";
import { CognitoAuth } from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import * as AWS from "aws-sdk";
import * as awsservice from "aws-sdk/lib/service";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import { environment } from "../environments/environment";
import { WindowToken } from "../factories/window.factory";
import { Amplify, Auth } from "aws-amplify";
import { access } from "fs";

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: environment.REGION,
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: environment.USER_POOL_ID,
    IdentityProvider: environment.IDENTITY_PROVIDER,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: environment.CLIENT_ID,

    oauth: {
      domain:
        environment.APP_DOMAIN +
        ".auth." +
        environment.REGION +
        ".amazoncognito.com",
      scope: ["email", "profile", "openid"],
      redirectSignIn: window.location.origin + "/index.html",
      redirectSignOut: window.location.origin + "/index.html",
      responseType: "token", // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
});

// You can get the current config object
const currentConfig = Auth.configure();

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
  callback(): void;
  callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoService {
  constructor(@Inject(WindowToken) private window: Window) {}

  public static _REGION = environment.REGION; // User pool AWS region
  public static _USER_POOL_ID = environment.USER_POOL_ID; // User pool ID
  public static _CLIENT_ID = environment.CLIENT_ID; // App client ID
  public static _IDENTITY_PROVIDER = environment.IDENTITY_PROVIDER; // User pool Identity provider name
  public static _APP_DOMAIN = environment.APP_DOMAIN; // App domain name
  public static _IDP_ENDPOINT =
    "cognito-idp." +
    CognitoService._REGION +
    ".amazonaws.com/" +
    CognitoService._USER_POOL_ID;

  public static _POOL_DATA: any = {
    UserPoolId: CognitoService._USER_POOL_ID,
    ClientId: CognitoService._CLIENT_ID,
  };

  // Authenticate the user & login
  async login() {
    try {
      await Auth.federatedSignIn({
        customProvider: CognitoService._IDENTITY_PROVIDER,
      });
      const user = Auth.currentAuthenticatedUser();
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  // Check if the user is already logged in
  isUserSessionActive(callback: LoggedInCallback) {
    Auth.currentAuthenticatedUser()
      .then((user) => callback.isLoggedIn("is logged in", true))
      .catch((err) => callback.isLoggedIn("is logged in", false));
  }

  // isUserSessionActive(callback: LoggedInCallback) {
  //   Auth.currentAuthenticatedUser()
  //     .then((user) => {
  //       // Start a timer to warn the user before session expiration
  //       const sessionTimeout = 15000; // 10 minutes in milliseconds
  //       const warningTime = 5000; // 8 minutes in milliseconds
  //       let timer: any;

  //       const startSessionTimer = () => {
  //         timer = setTimeout(() => {
  //           // Warn the user that their session is about to expire
  //           alert(
  //             "Your session is about to expire due to inactivity. Please continue your session or you will be logged out."
  //           );
  //           alert(
  //             "Your session has expired due to inactivity. You have been logged out."
  //           );
  //           console.log("RIGHT BEFORE LOGOUT");
  //           accout.userLogout();
  //           // this.logout();
  //         }, sessionTimeout - warningTime);
  //       };

  //       const resetSessionTimer = () => {
  //         clearTimeout(timer);
  //         startSessionTimer();
  //       };

  //       startSessionTimer();

  //       // Reset the timer when the page is refreshed
  //       window.addEventListener("beforeunload", resetSessionTimer);

  //       // Invoke the callback to indicate the user is logged in
  //       callback.isLoggedIn("is logged in", true);
  //     })
  //     .catch((err) => {
  //       // If there's an error, invoke the callback to indicate the user is not logged in
  //       callback.isLoggedIn("is logged in", false);
  //     });
  // }

  // Logout the user session
  logout() {
    try {
      Auth.signOut({ global: true });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  // Method to fetch the cognito ID token
  async getIdToken() {
    var session = await Auth.currentSession();
    var id = session.getIdToken().getJwtToken();
    return id;
  }

  buildDoTADRedirectUrl(): string {
    return this.buildBaseRedirectUrl() + `&client_id=${environment.CLIENT_ID}`;
  }

  buildLoginGovRedirectUrl(): string {
    return (
      this.buildBaseRedirectUrl() +
      `&client_id=${environment.LOGIN_GOV_COGNITO_APP_CLIENT_ID}`
    );
  }

  buildBaseRedirectUrl(): string {
    return (
      `https://${environment.APP_DOMAIN}.auth.${environment.REGION}` +
      `.amazoncognito.com/oauth2/authorize?redirect_uri=${this.redirectUrl()}` +
      `&response_type=token`
    );
  }

  redirectUrl() {
    return `${this.window.location.origin}/index.html`;
  }
}
