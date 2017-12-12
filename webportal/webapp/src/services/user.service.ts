import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import {CognitoCallback, CognitoUtil, LoggedInCallback} from "./cognito.service";
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";

@Injectable()
export class UserService {

  constructor(public cognitoUtil: CognitoUtil) { }

  authenticate(username: string, password: string, callback: CognitoCallback) {
    // var authData = {
    //     ClientId : '7342nq8oeb2ao2e33pk17bh1q2', // Your client id here
    //     AppWebDomain : 'https://test-sdc.auth.us-east-1.amazoncognito.com',
    //     TokenScopesArray : ["phone","email","openid","aws.cognito.signin.user.admin","profile"],
    //     RedirectUriSignIn : 'https://d4p2fyeb90av.cloudfront.net/index.html',
    //     RedirectUriSignOut : 'https://d4p2fyeb90av.cloudfront.net/index.html'
    // };
    // var auth = new CognitoAuth(authData);
    console.log("UserLoginService: starting the authentication")

    let authenticationData = {
        Username: username,
        Password: password,
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
        Username: username,
        Pool: this.cognitoUtil.getUserPool()
    };

    console.log("UserLoginService: Params set...Authenticating the user :" + username);
    let cognitoUser = new CognitoUser(userData);
    var self = this;
    cognitoUser.authenticateUser(authenticationDetails, {
        newPasswordRequired: function (userAttributes, requiredAttributes) {
            callback.cognitoCallback(`User needs to set password.`, null);
        },
        onSuccess: function (result) {
            console.log("In authenticateUser onSuccess callback");
            console.log(result);
            callback.cognitoCallback(null, null);
        },
        onFailure: function (err) {
            callback.cognitoCallback(err.message, null);
        },
    });
  }

  logout() {
    console.log("UserLoginService: Logging out");
    this.cognitoUtil.getCurrentUser().signOut();
  }

}