import { throwError as observableThrowError, Observable, from } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
//import { RequestOptions } from "@angular/http";
// import { Observable } from 'rxjs/Observable';
import { CognitoService } from "./cognito.service";
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
//import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler } from "@angular/common/http";
//import { Observable } from 'rxjs';
import { switchMap, tap } from "rxjs/operators";
//import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cognitoService: CognitoService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.startsWith("https://s3.amazonaws.com/")) {
      return next.handle(request);
    } else {
      return from(this.cognitoService.getIdToken()).pipe(
        tap((token) => console.log("TOKEN IN LOGINSYNCSERVICE ==", token)), // side effect to set token property on auth service
        switchMap((token) => {
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
}

@Injectable({
  providedIn: "root",
})
export class ApiGatewayService {
  //protected options: RequestOptions;
  private static _API_ENDPOINT = `${window.location.origin}/${environment.API_ENDPOINT}`;

  apiResponse: any;
  extractData: any;
  handleError: any;
  name = "ApiGatewayService";

  constructor(
    private http: HttpClient,
    private cognitoService: CognitoService
  ) {
    this.extractData = this.getExtractDataFunction();
    this.handleError = this.getHandleErrorFunction();
  }

  // Extract response
  public getExtractDataFunction() {
    return function (res: Response) {
      try {
        // return res.json(); //HttpClient returns json object response by default
        return res;
      } catch (e) {
        console.log("Response is not a JSON");
        return res.text().toString();
      }
    };
  }

  // Handle error
  public getHandleErrorFunction() {
    const _self = this;
    return function (error: any) {
      let message;
      try {
        const body = JSON.parse(error._body);
        if (body.message) {
          message = body.message;
        } else if (body.error) {
          message = body.error;
        } else {
          message = error._body;
        }
      } catch (e) {
        message = error._body;
      }
      error.statusText = message;
      error.message = message;
      return observableThrowError(error);
    };
  }

  get(url: string) {
    return this.http
      .get(ApiGatewayService._API_ENDPOINT + url)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  sendRequestMail(url: string) {
    return this.http
      .post(ApiGatewayService._API_ENDPOINT + url, "")
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getUserInfo(url: string) {
    return this.http
      .get(ApiGatewayService._API_ENDPOINT + url, { responseType: "json" })
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  post(url: string) {
    return this.http
      .post(ApiGatewayService._API_ENDPOINT + url, "", { responseType: "json" })
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getPresignedUrl(url: string) {
    return this.http
      .get(ApiGatewayService._API_ENDPOINT + url, { responseType: "text" })
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getDownloadUrl(url: string) {
    return this.http
      .get(ApiGatewayService._API_ENDPOINT + url, { responseType: "text" })
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getMetadataOfS3Object(url: string) {
    return this.http
      .get(ApiGatewayService._API_ENDPOINT + url)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  sendExportRequest(url: string) {
    console.log("sending request 2 " + ApiGatewayService._API_ENDPOINT + url);
    return this.http
      .post(ApiGatewayService._API_ENDPOINT + url, "")
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getDesiredInstanceTypesAndCosts(url: string) {
    return this.http
      .get(ApiGatewayService._API_ENDPOINT + url)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  modifyUserWorkstation(url: string) {
    return this.http
      .get(ApiGatewayService._API_ENDPOINT + url)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
}
