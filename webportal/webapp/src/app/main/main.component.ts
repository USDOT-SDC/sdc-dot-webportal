import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{

  constructor(private cognitoService: CognitoService, public router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if ((evt instanceof NavigationEnd)) {
              window.scrollTo(0, 0);
            }
            return;
        });
    }
  userLogin() {
    this.cognitoService.login(false);
  }

}
