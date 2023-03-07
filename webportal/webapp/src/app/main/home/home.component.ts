import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CognitoService } from '../../../services/cognito.service';
import { LoaderComponent } from '../../account/components/loader/loader.component';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, LoaderComponent, RouterModule, ButtonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private cognitoService: CognitoService,
    private router: Router) {
       //router.events.subscribe(event => {
       //    if (event instanceof NavigationEnd) {
       //        const tree = router.parseUrl(router.url);
       //        if (tree.fragment) {
       //            const element = document.querySelector("#" + tree.fragment);
       //            if (element) { element.scrollIntoView(); }
       //        }
       //    }
       //});
  }

 
  getCurrentURL() {
    return window.location.href;
  }

  ngOnInit() {
    if (this.getCurrentURL().indexOf('access_token') !== -1) {
      this.cognitoService.onLoad();
      this.router.navigate(['account']);
    }
    this.cognitoService.isUserSessionActive(this);
  }

  isLoggedIn(message: string, loggedIn: boolean) {
    if (loggedIn) {
      console.log('The user is authenticated: ' + loggedIn);
      this.router.navigate(['account']);
    } else {
        console.log('User not authenticated: ' + loggedIn);
    }
  }

}
