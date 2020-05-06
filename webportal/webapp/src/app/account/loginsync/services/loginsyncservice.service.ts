import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';
import { CognitoService } from '../../../../services/cognito.service';

@Injectable()
export class LoginSyncService {
  httpOptions = {};
  env = environment.production ? 'prod' : 'dev';
  linkAccountUrl = `${environment.LOGIN_GOV_ACCOUNT_LINK_URL}/account-link-${this.env}/${this.env}-link-account`;
  accountLinkedUrl = `${environment.LOGIN_GOV_ACCOUNT_LINK_URL}/account-link-${this.env}/${this.env}-account-linked`;

  constructor(private http: HttpClient, private cognitoService: CognitoService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': ' ' + this.cognitoService.getIdToken(),
        'Access-Control-Allow-Origin': '*'
      })
    };
  }

  userAccountsLinked(): Observable<any> {
    return this.http.get(this.accountLinkedUrl, this.httpOptions)
      .map((response) => {
        return Observable.of(response);
      }).catch(this.handleError);
  }

  linkAccounts(username: string, password: string): Observable<any> {
    const payload = {
      'username': username,
      'password': password
    };

    return this.http.post(this.linkAccountUrl, payload, this.httpOptions)
      .map((response) => {
        return Observable.of(response);
      }).catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    const devErrorMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    const userErrorMsg = (error.error) ? error.error['userErrorMessage'] : 'Sorry, something went wrong. Please try again later';

    console.log(devErrorMsg);
    return Observable.throw(userErrorMsg);
  }
}
