import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from "../../services/cognito.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(
    private cognitoService: CognitoService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  userLogout() {
    this.cognitoService.logout();
    this.router.navigate(['/']);
  }

}
