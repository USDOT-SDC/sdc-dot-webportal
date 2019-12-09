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
  verified = false;

  constructor(private loginSyncService: LoginSyncService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.verified = this.loginSyncService.loginGovCredentialVerification(this.username, this.password);
    console.log(`User tried to sign in with creds: ${this.username}, ${this.password}`);

    if (this.verified) {
      this.router.navigate(['account/accounthome']); // Redirect to the user homepage
    } else {
      // TDOD: What do we want to show if the Login.gov creds are incorrect?
    }
  }
}
