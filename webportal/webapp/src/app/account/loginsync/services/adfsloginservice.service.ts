import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AdfsLoginService {

  constructor(private http: HttpClient) { }

  // TODO: Reach out to API for this result
  userSignedInWithADFSCreds(): any {
    return false;
  }
}