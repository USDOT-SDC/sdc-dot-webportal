import { Component, OnInit } from '@angular/core';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CognitoService } from '../../../../services/cognito.service';

@Component({
  selector: 'app-loginsync',
  templateUrl: './loginsync.component.html',
  styleUrls: ['./loginsync.component.css',
              '../../../../../node_modules/uswds/src/stylesheets/uswds.scss']
})
export class LoginSyncComponent implements OnInit {
  username: string;
  password: string;
  linkSuccessful = true;
  errorMessage = '';

  constructor(private loginSyncService: LoginSyncService, private router: Router, private cognitoService: CognitoService) { }

  ngOnInit() {
  }

  onSubmit() {
    /*
      { 'statusCode': 200, 'body': '{}' }
    */
    this.loginSyncService
        .linkAccounts(this.username, this.password)
        .subscribe(
          result => {
            this.linkSuccessful = true;

            // TODO navigate back to login page
            this.router.navigate(['account/accounthome']);
          },
          error => {
            this.linkSuccessful = false;
            this.errorMessage =  error;
            console.log(this.errorMessage);
          });
  }

  buildRedirectUrl(): string {
    console.log('environment.production', environment.production);
    return '';
  }
}
