import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../../services/cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  constructor(
    private cognitoService: CognitoService,
    private router: Router) { }

  ngOnInit() {
    var currentUrl = window.location.href;
    if (currentUrl.indexOf("access_token") !== -1) {
      this.cognitoService.onLoad();
      this.router.navigate(['account']);
    }
    this.cognitoService.isUserSessionActive(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      console.log("The user is authenticated: " + isLoggedIn);
      this.router.navigate(['account']);
    } else
      console.log("User not authenticated: " + isLoggedIn);
  }

}
