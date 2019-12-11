import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class LoginSyncGuard implements CanActivate {
  constructor(private loginSyncService: LoginSyncService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginSyncService.userAccountsLinked()
                                .map(response => {
                                  if (response.value['accountLinked']) {
                                    return true; // Continue to the /accounthome page
                                  }
                                  this.router.navigate(['account/loginsync']); // Navigate to the /loginsync page
                                  return false;
                                }).catch(error => {
                                  console.log('error', error);
                                  return of(false);
                                });
  }
}
