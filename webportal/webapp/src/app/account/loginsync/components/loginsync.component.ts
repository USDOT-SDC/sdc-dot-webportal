import { Component, OnInit } from '@angular/core';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { environment } from '../../../../environments/environment';
import { CognitoService } from '../../../../services/cognito.service';

@Component({
  selector: 'app-loginsync',
  templateUrl: './loginsync.component.html',
  styleUrls: ['./loginsync.component.css']
})
export class LoginSyncComponent implements OnInit {
  username: string;
  password: string;
  linkSuccessful = true;
  errorMessage = '';

  constructor(private loginSyncService: LoginSyncService, private cognitoService: CognitoService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loginSyncService
        .linkAccounts(this.username, this.password)
        .subscribe(
          result => {
            this.linkSuccessful = true;

            // Redirect back to login page
            window.location.href = this.buildRedirectUrl();
          },
          error => {
            this.linkSuccessful = false;
            this.errorMessage =  error;
          });
  }

  buildRedirectUrl(): string {
    const env = environment.production ? 'prod' : 'dev';
    const url = `https://${env}-sdc-dot-webportal.auth.${environment.REGION}` +
                `.amazoncognito.com/oauth2/authorize?redirect_uri=${environment.REDIRECT_URL}` +
                `&response_type=token&client_id=${environment.LOGIN_GOV_COGNITO_APP_CLIENT_ID}`;
    return url;
  }
}
