import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSyncService } from '../services/loginsyncservice.service';

@Injectable()
export class LoginSyncGuard implements CanActivate {
  accountsLinked = false;

  constructor(private loginSyncService: LoginSyncService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      /*
        {
          'statusCode': 200,
          'body': { 'accountLinked': true }
        }
      */
     console.log('before');
      this.loginSyncService
          .userAccountsLinked()
          .subscribe(
            result => { 
              console.log('inside');
              console.log(result);
              this.accountsLinked = result.value.accountLinked; },
            error => {
              console.log(error);
            });
      console.log('after');
      if (this.accountsLinked) {
        return true; // Continue to account/accounthome
      }
      this.router.navigate(['account/loginsync']); // Redirect to the /loginsync page if the user signed in with Login.gov creds
      return false;
  }
}
