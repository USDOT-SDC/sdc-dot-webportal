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
  newPassword: string;
  newPasswordConfirmation: string;
  changeTemporaryPassword = false;
  errorMessage = '';

  constructor(private loginSyncService: LoginSyncService, private cognitoService: CognitoService) { }

  ngOnInit() {
  }

  onSubmitLinkAccount() {
    this.loginSyncService
        .linkAccounts(this.username, this.password)
        .subscribe(
          result => {
            // Redirect back to login page
            window.location.href = this.cognitoService.buildLoginGovRedirectUrl();
          },
          error => {
            if(error.body.passwordExpired) {
                this.changeTemporaryPassword = true;
            } else {
                this.errorMessage = error.userErrorMessage;
            }
          });
  }

  onSubmitChangeTemporaryPassword() {
    if(!this.isValidPassword()) {
        return;
    }

    this.loginSyncService
        .resetTemporaryPassword(this.username, this.password, this.newPassword, this.newPasswordConfirmation)
        .subscribe(
          result => {
            this.changeTemporaryPassword = false;
            this.password = "";
          },
          error => {
            this.errorMessage = error.userErrorMessage;
          });
  }



  isValidPassword() {
    var hasUpperCase = /[A-Z]/.test(this.newPassword) ? 1 : 0;
    var hasLowerCase = /[a-z]/.test(this.newPassword) ? 1 : 0;
    var hasNumbers = /\d/.test(this.newPassword) ? 1 : 0;
    var hasSpecialCharacters = /\W/.test(this.newPassword) ? 1 : 0;
    var hasSevenCharacters = this.newPassword.length >= 7;

    var validPassword = (hasSevenCharacters && ((hasUpperCase + hasLowerCase + hasNumbers + hasSpecialCharacters) >= 3));
    if(!validPassword) {
      this.errorMessage = "The password does not match the complexity criteria."
      return false;
    } else if(this.newPassword != this.newPasswordConfirmation) {
      this.errorMessage = "Passwords must match."
      return false;
    } else {
      this.errorMessage = "";
      return true;
    }
  }
}
