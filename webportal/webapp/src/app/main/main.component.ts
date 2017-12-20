import { Component } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private cognitoService: CognitoService) { }

  userLogin() {
    this.cognitoService.login(false);
  }

}
