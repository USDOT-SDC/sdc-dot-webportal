import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class LoginSyncService {
  // THESE ARE DEV URLS, Need env-specific urls
  linkAccountUrl = 'https://aae0n1czsf.execute-api.us-east-1.amazonaws.com/dev/dev-link-account';
  accountLinkedUrl = 'https://aae0n1czsf.execute-api.us-east-1.amazonaws.com/dev/dev-account-linked';

  constructor(private http: HttpClient) { }

  userAccountsLinked(): Observable<any> {
    return this.http.get(this.accountLinkedUrl)
      .map((response) => {
        return Observable.throw(response);
      }).catch(this.handleError);
  }

  linkAccounts(username: string, password: string): Observable<any> {
    const payload = {
      'username': username,
      'password': password
    };

    return this.http.post(this.linkAccountUrl, payload, httpOptions)
      .map((response) => {
        return Observable.throw(response);
      }).catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
