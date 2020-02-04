import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { of } from 'rxjs/observable/of';
import { e } from '@angular/core/src/render3';

@Injectable()
export class LoginSyncGuard implements CanActivate {
  linked = false;
  constructor(private loginSyncService: LoginSyncService, private router: Router) { }

  canActivate(): boolean {
    this.loginSyncService.userAccountsLinked()
                          .subscribe(response => {
                            console.log('GUARD', response);
                            if (response['accountLinked']) {
                              console.log('true!');
                              this.linked = true; // Continue to the /accounthome page
                            } else {
                              this.linked = false;
                              this.router.navigate(['account/loginsync']); // Navigate to the /loginsync page
                              console.log('false!');
                            }
                          });
    return this.linked;
  }
}
