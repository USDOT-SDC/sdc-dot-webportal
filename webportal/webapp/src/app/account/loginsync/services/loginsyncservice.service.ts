import { throwError as observableThrowError, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
} from "@angular/common/http";
import { from } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { CognitoService } from "../../../../services/cognito.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cognitoService: CognitoService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.cognitoService.getIdToken()).pipe(
      tap((token) => console.log("TOKEN IN LOGINSYNCSERVICE ==", token)), // side effect to set token property on auth service
      switchMap((token) => {
        // use transformation operator that maps to an Observable<T>
        const newRequest = request.clone({
          withCredentials: true,
          setHeaders: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
        });
        return next.handle(newRequest);
      })
    );
  }
}

@Injectable({
  providedIn: "root",
})
export class LoginSyncService {
  //httpOptions = {};
  baseUrl = `${window.location.origin}/${environment.ACCOUNT_LINK_URL}`;
  linkAccountUrl = `${this.baseUrl}/${environment.LINK_ACCOUNT_PATH}`;
  accountLinkedUrl = `${this.baseUrl}/${environment.ACCOUNT_LINKED_PATH}`;
  resetTemporaryPasswordUrl = `${this.baseUrl}/${environment.RESET_TEMPORARY_PASSWORD_PATH}`;

  constructor(
    private http: HttpClient,
    private cognitoService: CognitoService
  ) {}

  // {
  //   let authToken1 = this.cognitoService.getIdToken();
  //   var authToken = authToken1.toString();
  //   this.httpOptions = {
  //     headers: new HttpHeaders({
  //       "Content-Type": "application/json",
  //       Authorization: " " + authToken,
  //       "Access-Control-Allow-Origin": "*",
  //     }),
  //   };
  // }

  userAccountsLinked(): Observable<any> {
    console.log("userAccountsLinked");
    return this.http.get(this.accountLinkedUrl).pipe(
      map((response) => {
        console.log("RESPONSE in userAccountsLinked ==", response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  linkAccounts(username: string, password: string): Observable<any> {
    const payload = {
      username: username,
      password: password,
    };
    console.log("linkAccounts Payload ==", payload);
    return this.http.post(this.linkAccountUrl, payload).pipe(
      map((response) => {
        console.log("RESPONSE ==", response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  resetTemporaryPassword(
    username: string,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ): Observable<any> {
    const payload = {
      username: username,
      currentPassword: currentPassword,
      newPassword: newPassword,
      newPasswordConfirmation: newPasswordConfirmation,
    };

    return this.http.post(this.resetTemporaryPasswordUrl, payload).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const devErrorMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : "Server error";
    const userErrorMessage = error.error
      ? error.error["userErrorMessage"]
      : "Sorry, something went wrong. Please try again later";

    console.log(devErrorMsg);
    return observableThrowError({
      userErrorMessage: userErrorMessage,
      body: error.error,
    });
  }
}
