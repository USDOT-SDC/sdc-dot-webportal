import { Component, OnInit } from '@angular/core';
import {CognitoService} from '../../../services/cognito.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;

  constructor(private cognitoService: CognitoService) { }
  ngOnInit() {
  }
  userLogin() {
    if (this.email.endsWith('dot.gov')) {
      this.cognitoService.login(false); // Route to ADFS login
    } else {
      window.location.href = this.buildLoginGovUrl(); // Route to Login.gov
    }
  }

  buildLoginGovUrl() {
    // The dev cognito user pool is used in prod. Hardcoding for now... :-(
    return `https://dev-sdc-dot-webportal.auth.${environment.REGION}` +
            `.amazoncognito.com/oauth2/authorize?redirect_uri=${environment.REDIRECT_URL}` +
            `&response_type=token&client_id=${environment.LOGIN_GOV_COGNITO_APP_CLIENT_ID}`;
  }
}
