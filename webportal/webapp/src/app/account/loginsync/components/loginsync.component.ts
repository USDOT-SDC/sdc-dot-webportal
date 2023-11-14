import { Component, OnInit, Inject } from "@angular/core";
import { LoginSyncService } from "../services/loginsyncservice.service";
import { environment } from "../../../../environments/environment";
import { CognitoService } from "../../../../services/cognito.service";
import { WindowToken } from "../../../../factories/window.factory";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "../../components/loader/loader.component";
import { AlertComponent } from "../../components/alert/alert.component";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [CommonModule, LoaderComponent, AlertComponent, FormsModule],
  selector: "app-loginsync",
  templateUrl: "./loginsync.component.html",
  styleUrls: ["./loginsync.component.css"],
})
export class LoginSyncComponent implements OnInit {
  username: string;
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
  changeTemporaryPassword = false;
  errorMessage = "";
  complexityErrorMessage: string =
    "The password does not match the complexity criteria.";
  passwordMatchingErrorMessage: string = "Passwords must match.";

  constructor(
    private loginSyncService: LoginSyncService,
    private cognitoService: CognitoService,
    @Inject(WindowToken) private window: Window
  ) {}

  ngOnInit() {}

  onSubmitLinkAccount() {
    this.loginSyncService.linkAccounts(this.username, this.password).subscribe(
      (result) => {
        this.redirectUser(result);
      },
      (error) => {
        if (error.body.passwordExpired) {
          this.changeTemporaryPassword = true;
          this.errorMessage = "";
        } else {
          console.log("ERRORED")
          console.log("userErrorMessage = ", error.userErrorMessage)
          this.errorMessage = error.userErrorMessage;
        }
      }
    );
  }

  onSubmitChangeTemporaryPassword() {
    if (!this.isValidPassword()) {
      return;
    }

    this.loginSyncService
      .resetTemporaryPassword(
        this.username,
        this.password,
        this.newPassword,
        this.newPasswordConfirmation
      )
      .subscribe(
        (result) => {
          this.redirectUser(result);
        },
        (error) => {
          this.errorMessage = error.userErrorMessage;
        }
      );
  }

  redirectUser(result) {
    const dotUser = "dot_active_directory_user";
    this.window.location.href =
      result.signInType === dotUser
        ? this.cognitoService.buildDoTADRedirectUrl()
        : this.cognitoService.buildLoginGovRedirectUrl();
    console.log("THIS WINDOW HERE == ", this.window.location.href);
  }

  isValidPassword() {
    var hasUpperCase = /[A-Z]/.test(this.newPassword) ? 1 : 0;
    var hasLowerCase = /[a-z]/.test(this.newPassword) ? 1 : 0;
    var hasNumbers = /\d/.test(this.newPassword) ? 1 : 0;
    var hasSpecialCharacters = /\W/.test(this.newPassword) ? 1 : 0;
    var hasSevenCharacters = this.newPassword.length >= 7;

    var validPassword =
      hasSevenCharacters &&
      hasUpperCase + hasLowerCase + hasNumbers + hasSpecialCharacters >= 3;
    if (!validPassword) {
      this.errorMessage = this.complexityErrorMessage;
      return false;
    } else if (this.newPassword != this.newPasswordConfirmation) {
      this.errorMessage = this.passwordMatchingErrorMessage;
      return false;
    } else {
      this.errorMessage = "";
      return true;
    }
  }
}
