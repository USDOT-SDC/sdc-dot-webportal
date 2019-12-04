import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/observable';

@Injectable()
export class LoginSyncGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

      // TODO: write a service that fetches JWT auth results and call here
      if (1 === 1) {
        // If the user signed in with ADFS creds, continue to /accounthome
        return true;
      }
      // If the user signed in with Login.gov creds, redirect to the /loginsync page
      this.router.navigate(['/loginsync']);
      return false;
  }
}
