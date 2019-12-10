import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class LoginSyncService {
  env = environment.production === 'true' ? 'prod' : 'dev';
  linkAccountUrl = `https://aae0n1czsf.execute-api.us-east-1.amazonaws.com/${this.env}/${this.env}-link-account`;
  accountLinkedUrl = `https://aae0n1czsf.execute-api.us-east-1.amazonaws.com/${this.env}/${this.env}-account-linked`;

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
