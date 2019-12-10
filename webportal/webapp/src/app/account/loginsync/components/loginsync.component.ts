import { Component, OnInit } from '@angular/core';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginsync',
  templateUrl: './loginsync.component.html',
  styleUrls: ['./loginsync.component.css',
              '../../../../../node_modules/uswds/src/stylesheets/uswds.scss']
})
export class LoginSyncComponent implements OnInit {
  username: string;
  password: string;
  linkSuccessful = false;
  errorMessage = '';

  constructor(private loginSyncService: LoginSyncService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    /*
      { 'statusCode': 200, 'body': '{}' }
    */
    this.loginSyncService
        .linkAccounts(this.username, this.password)
        .subscribe(result => {
          this.linkSuccessful = result['statusCode'] === 200;
          this.errorMessage = result['body']['userErrorMessage'];
        });

    if (this.linkSuccessful) {
      // TODO redirect BACK to the Login.gov sign in page
      // Something to do with this: https://dev-sdc-dot-webportal.auth.us-east-1.amazoncognito.com/oauth2/authorize?redirect_uri=https://dev-portal.securedatacommons.com/index.html&response_type=token&client_id=kfjfmaq0jvfjoq9gbt26c732o
      this.router.navigate(['account/accounthome']);
    } else {
      // TODO: Show an alert with the error message
      console.log(this.errorMessage);
    }
  }
}
