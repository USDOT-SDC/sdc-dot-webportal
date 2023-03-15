import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CognitoService } from '../../../services/cognito.service';
import { LoaderComponent } from '../../account/components/loader/loader.component';
import {CardModule} from 'primeng/card';
import {SplitButtonModule} from 'primeng/splitbutton';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, LoaderComponent, RouterModule, ButtonModule, CardModule, SplitButtonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private cognitoService: CognitoService,
    private router: Router) {
  }

 
  getCurrentURL() {
    return window.location.href;
  }

  ngOnInit() {
    if (this.getCurrentURL().indexOf('code') !== -1) {
      // this.cognitoService.onLoad();
      this.router.navigate(['account']);
    }
    this.cognitoService.isUserSessionActive(this);
  }

  isLoggedIn(message:
     string, loggedIn: boolean) {
    if (loggedIn) {
      console.log('The user is authenticated: ' + loggedIn);
      console.log('Navigate to: ' + this.router.navigate(['account']))
      this.router.navigate(['account']);
    } else {
        console.log('User not authenticated. Logged in: ' + loggedIn);
    }
  }
}
