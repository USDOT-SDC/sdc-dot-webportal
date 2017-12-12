import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../../../services/user.service";
import { CognitoCallback, LoggedInCallback } from "../../../services/cognito.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {

  constructor(
    private router: Router,
    public userService: UserService) { }

  user: any = {};
  errorMessage: string;

  ngOnInit() {
  }

  login() {
    this.errorMessage = null;
    // this.router.navigate(['home']);
    this.userService.authenticate(this.user.username, this.user.password, this);
  }

  cognitoCallback(message: string, result: any) {
      if (message != null) { //error
          this.user = {};
          this.errorMessage = message;
      } else { //success
          this.router.navigate(['home']);
      }
    }

  isLoggedIn(message: string, isLoggedIn: boolean) {
      if (isLoggedIn)
          this.router.navigate(['home']);
  }

}
