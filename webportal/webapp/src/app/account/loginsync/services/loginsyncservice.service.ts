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
  url = 'https://whatever.url';

  constructor(private http: HttpClient) { }

  // TODO: Reach out to API for this result
  userSignedInWithADFSCreds(): boolean {
    return false;
    // return this.http.get<boolean>(this.url);
  }

  // TODO: reach out to API for this result
  loginGovCredentialVerification(username: string, password: string): boolean {
    return true;
    // return this.http.get<boolean>(this.url);
  }
}
