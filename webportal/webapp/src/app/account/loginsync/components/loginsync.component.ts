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
    const dotUser = 'dot_active_directory_user';
    this.loginSyncService
        .linkAccounts(this.username, this.password)
        .subscribe(
          result => {
            this.linkSuccessful = true;
            window.location.href = result.value.signInType === dotUser ? this.buildDoTADRedirectUrl() : this.buildLoginGovRedirectUrl();
          },
          error => {
            this.linkSuccessful = false;
            this.errorMessage =  error;
          });
  }

  buildLoginGovRedirectUrl(): string {
    return this.buildBaseRedirectUrl() + `&client_id=${environment.LOGIN_GOV_COGNITO_APP_CLIENT_ID}`
  }

  buildDoTADRedirectUrl(): string {
    return this.buildBaseRedirectUrl() + `&client_id=${environment.CLIENT_ID}`;
  }

  buildBaseRedirectUrl(): string {
    return `https://${environment.APP_DOMAIN}.auth.${environment.REGION}` +
                `.amazoncognito.com/oauth2/authorize?redirect_uri=${environment.REDIRECT_URL}` +
                `&response_type=token`;
  }
}
