import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSyncService } from '../services/loginsyncservice.service';

@Injectable()
export class LoginSyncGuard implements CanActivate {
  signedInWithAdfsCreds = false;

  constructor(private loginSyncService: LoginSyncService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      this.loginSyncService
          .userSignedInWithADFSCreds()
          .subscribe(result => this.signedInWithAdfsCreds = result);

      if (this.signedInWithAdfsCreds) {
        return true; // Continue to homepage if user signed in with ADFS creds
      }
      this.router.navigate(['account/loginsync']); // Redirect to the /loginsync page if the user signed in with Login.gov creds
      return false;
  }
}
