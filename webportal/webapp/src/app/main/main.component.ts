import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{

  constructor(private cognitoService: CognitoService, public router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }
  userLogin() {
    this.cognitoService.login(false);
  }

}
