import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSyncService } from '../services/loginsyncservice.service';

@Injectable()
export class LoginSyncGuard implements CanActivate {
  signedInWithAdfsCreds = false;

  constructor(private loginSyncService: LoginSyncService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      /*
        {
          'statusCode': 200,
          'body': { 'accountLinked': true }
        }
      */
      this.loginSyncService
          .userSignedInWithADFSCreds()
          .subscribe(result => {
            this.signedInWithAdfsCreds = result['body']['accountLinked'];
          });

      if (this.signedInWithAdfsCreds) {
        // TODO redirect BACK to the Login.gov sign in page
        // Something to do with this: https://dev-sdc-dot-webportal.auth.us-east-1.amazoncognito.com/oauth2/authorize?redirect_uri=https://dev-portal.securedatacommons.com/index.html&response_type=token&client_id=kfjfmaq0jvfjoq9gbt26c732o
        return true;
      }
      this.router.navigate(['account/loginsync']); // Redirect to the /loginsync page if the user signed in with Login.gov creds
      return false;
  }
}
