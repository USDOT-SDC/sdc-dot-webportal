import { Component, OnInit } from '@angular/core';
import {CognitoService} from '../../../services/cognito.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule],
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
    if (this.email.toLowerCase().endsWith('@dot.gov')) {                
      this.cognitoService.login(false); // Route to ADFS login
    } else {
      window.location.href = this.cognitoService.buildLoginGovRedirectUrl();
    }
  }
}
