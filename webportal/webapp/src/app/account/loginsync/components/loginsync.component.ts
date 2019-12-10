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
    console.log(`User entered login.gov creds: ${this.username}, ${this.password}`);

    this.loginSyncService
        .linkAccounts(this.username, this.password)
        .subscribe(result => this.verified = result);

    if (this.verified) {
      this.router.navigate(['account/accounthome']); // Redirect to the user homepage
    } else {
      // TODO: What do we want to show if the Login.gov creds are incorrect?
      console.log('Sorry we could not authenticate those credentials');
    }
  }
}
