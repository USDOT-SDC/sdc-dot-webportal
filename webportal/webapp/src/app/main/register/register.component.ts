import { Component, OnInit } from '@angular/core';
import {CognitoService} from '../../../services/cognito.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private cognitoService: CognitoService) { }
  ngOnInit() {
  }
  userLogin() {
      this.cognitoService.login(false);
  }
}
