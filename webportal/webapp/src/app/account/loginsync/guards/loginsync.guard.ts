import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { CognitoService } from '../../../../services/cognito.service';
import { WindowToken } from '../../../../factories/window.factory';
import { of } from 'rxjs/observable/of';

@Injectable()
export class LoginSyncGuard implements CanActivate {
  constructor(private loginSyncService: LoginSyncService, private router: Router, private cognitoService: CognitoService,
              @Inject(WindowToken) private window: Window) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginSyncService.userAccountsLinked()
                                .map(response => {
                                    if (response['migratedLegacyUser'] === true) {
                                        this.window.location.href = this.cognitoService.buildLoginGovRedirectUrl();
                                        return false;
                                    } else if(response['accountLinked'] === true) {
                                        return true; // Continue to the /accounthome page
                                    }
                                    this.router.navigate(['account/loginsync']);
                                    return false;
                                }).catch(error => {
                                  const msg = error ? error.message : 'Caught an error from the loginSyncService call but no message error message was provided';
                                  console.log(msg);
                                  return of(true); // Continue to the /accounthome pahe
                                });
  }
}
