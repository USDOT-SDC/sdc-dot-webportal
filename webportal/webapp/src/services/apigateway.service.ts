
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import { CognitoService } from './cognito.service';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable()
export class ApiGatewayService {

    // protected options: RequestOptions;
    private static _API_ENDPOINT = `${window.location.origin}/${environment.API_ENDPOINT}`;

    apiResponse: any;
    // extractData: any;
    handleError: any;
    name = "ApiGatewayService";

    constructor(
        private http: HttpClient,
        private cognitoService: CognitoService) {
        // this.extractData = this.getExtractDataFunction();
        this.handleError = this.getHandleErrorFunction();
    }

 /* // Extract response
    public getExtractDataFunction() {
        return function (res: Response) {
            try {
                // return res.json(); //HttpClient returns json object response by default
                return res
            } catch (e) {
                console.log('Response is not a JSON');
                return res.text().toString();
            }
        };
    } */

    // Handle error
    public getHandleErrorFunction() {
        const _self = this;
        return function (error: any) {
            let message;
            try {
               // const body = JSON.parse(error._body);
                let body = error._body;
                if (body.message) {
                    message = body.message;
                }
                else if (body.error) {
                    message = body.error;
                } else {
                    message = error._body;
                }
            }
            catch (e) {
                message = error._body
            }
            error.statusText = message;
            error.message = message;
            return observableThrowError(error);
        };
    }

    // Set required headers on the request - updated for HttpClient Module
    constructHttpOptions(restype: string = 'json') {
        let authToken = this.cognitoService.getIdToken();
        const httpOptions: Object = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': " " + authToken,
                'Access-Control-Allow-Origin': '*'
            }),
            responseType: restype
        };
        return httpOptions;
     }

    // HTTP GET method invocation
    get(url: string) {
        const httpOptions = this.constructHttpOptions();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }
 
    sendRequestMail(url: string) {
        const httpOptions = this.constructHttpOptions();
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    getUserInfo(url: string) {
        const httpOptions = this.constructHttpOptions();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    post(url: string){
        const httpOptions = this.constructHttpOptions();
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    getPresignedUrl(url: string){
        const httpOptions = this.constructHttpOptions('Text');
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    getDownloadUrl(url: string){
        const httpOptions = this.constructHttpOptions('Text');
        return this.http.get(ApiGatewayService._API_ENDPOINT + url,  httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    getMetadataOfS3Object(url: string){
        const httpOptions = this.constructHttpOptions();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    sendExportRequest(url: string) {
        const httpOptions = this.constructHttpOptions();
        console.log("sending request 2 " + ApiGatewayService._API_ENDPOINT + url ) 
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    getDesiredInstanceTypesAndCosts(url: string){
        const httpOptions = this.constructHttpOptions();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }

    modifyUserWorkstation(url: string){
        const httpOptions = this.constructHttpOptions();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, httpOptions).pipe(
            // map(this.extractData),
            catchError(this.handleError),);
    }
}
