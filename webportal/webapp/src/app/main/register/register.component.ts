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
      window.location.href = this.cognitoService.buildLoginGovRedirectUrl();
    }
  }
}
