import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  userAccountsLinked(): Observable<boolean> {
    return this.http.get<any>(this.accountLinkedUrl);
  }

  linkAccounts(username: string, password: string): Observable<boolean> {
    const payload = {
      'username': username,
      'password': password
    };

    return this.http.post<any>(this.linkAccountUrl, payload, httpOptions);
  }
}