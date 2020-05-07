import { Injectable, Inject } from "@angular/core";
import {
    AuthenticationDetails,
    CognitoIdentityServiceProvider,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool
} from "amazon-cognito-identity-js";
import { CognitoAuth } from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import * as AWS from "aws-sdk";
import * as awsservice from "aws-sdk/lib/service";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import { environment } from '../environments/environment';
import { WindowToken } from '../factories/window.factory';


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
    constructor(@Inject(WindowToken) private window: Window) { }


    public static _REGION = environment.REGION // User pool AWS region
    public static _USER_POOL_ID = environment.USER_POOL_ID // User pool ID
    public static _CLIENT_ID = environment.CLIENT_ID // App client ID
    public static _IDENTITY_PROVIDER = environment.IDENTITY_PROVIDER // User pool Identity provider name
    public static _APP_DOMAIN = environment.APP_DOMAIN // App domain name
    public static _IDP_ENDPOINT = "cognito-idp." + CognitoService._REGION + ".amazonaws.com/" + CognitoService._USER_POOL_ID
    
    public static _POOL_DATA:any = {
        UserPoolId: CognitoService._USER_POOL_ID,
        ClientId: CognitoService._CLIENT_ID
    };

    // Authenticate the user & login
    login(isLoggedIn: boolean) {
        var userAuth = new CognitoAuth(this.authData())
        userAuth.userhandler = {
            onSuccess: function(result) {
            },
            onFailure: function(err) {
            }
        };
        if (isLoggedIn) {
            var currentUrl = window.location.href;
            userAuth.parseCognitoWebResponse(currentUrl);
        } else
            userAuth.getSession();
    }

    authData() {
        return {
            ClientId : CognitoService._CLIENT_ID,
            AppWebDomain : CognitoService._APP_DOMAIN + ".auth." + CognitoService._REGION + ".amazoncognito.com",
            TokenScopesArray : ['email', 'profile','openid' ],
            RedirectUriSignIn : this.redirectUrl(),
            RedirectUriSignOut : this.redirectUrl(),
            IdentityProvider : CognitoService._IDENTITY_PROVIDER,
            UserPoolId : CognitoService._USER_POOL_ID,
            AdvancedSecurityDataCollectionFlag : false
        };
    }

    // Immediately after login
    onLoad() {
        this.login(true)
    }

    // Check if the user is already logged in
    isUserSessionActive(callback: LoggedInCallback) {
        var currentUser = this.getCurrentUser()

        if (currentUser != null) {
            currentUser.getSession(function (err, session) {
                if (err) {
                    console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false);
                }
                else {
                    console.log("UserLoginService: Session is " + session.isValid());
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            console.log("UserLoginService: can't retrieve the current user");
            callback.isLoggedIn("Can't retrieve the CurrentUser", false);
        }

    }

    // Create UserPool object
    getUserPool() {
        return new CognitoUserPool(CognitoService._POOL_DATA);
    }

    // Fetch the current logged in user
    getCurrentUser() {
        return this.getUserPool().getCurrentUser();
    }

    // Logout the user session
    logout() {
        var userAuth = new CognitoAuth(this.authData())
        userAuth.userhandler = {
            onSuccess: function(result) {
            },
            onFailure: function(err) {
            }
        };
        // userAuth.signOut();
        this.getCurrentUser().signOut();
        localStorage.clear();
    }

    // Method to fetch the cognito ID token
    getIdToken() {
        var cognitoUser = this.getCurrentUser();
        var idToken = ''
        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    alert(err);
                    return;
                }
                console.log('session validity: ' + session.isValid());
                idToken = session.getIdToken().getJwtToken()
            });
        } else {
            console.log("NO TOKEN")
        }
        return idToken
    }

    buildDoTADRedirectUrl(): string {
        return this.buildBaseRedirectUrl() + `&client_id=${environment.CLIENT_ID}`;
    }

    buildLoginGovRedirectUrl(): string {
        return this.buildBaseRedirectUrl() + `&client_id=${environment.LOGIN_GOV_COGNITO_APP_CLIENT_ID}`
    }

    buildBaseRedirectUrl(): string {
        return `https://${environment.APP_DOMAIN}.auth.${environment.REGION}` +
               `.amazoncognito.com/oauth2/authorize?redirect_uri=${this.redirectUrl()}` +
               `&response_type=token`;
    }

    redirectUrl() {
        return `${this.window.location.origin}/index.html`;
    }

    // TODO: Add refresh token logic
}
