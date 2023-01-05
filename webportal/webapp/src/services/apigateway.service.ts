
import {throwError as observableThrowError,  Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
import { CognitoService } from './cognito.service';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable()
export class ApiGatewayService {

    protected options: RequestOptions;
    private static _API_ENDPOINT = `${window.location.origin}/${environment.API_ENDPOINT}`;

    apiResponse: any;
    extractData: any;
    handleError: any;
    name = "ApiGatewayService";

    constructor(
        private http: HttpClient,
        private cognitoService: CognitoService) {
        this.extractData = this.getExtractDataFunction();
        this.handleError = this.getHandleErrorFunction();
    }

    // Extract response
    public getExtractDataFunction() {
        return function (res: Response) {
            try {
                return res.json();
            } catch (e) {
                console.log('Response is not a JSON');
                return res.text().toString();
            }
        };
    }

    // Handle error
    public getHandleErrorFunction() {
        let _self = this;
        return function (error: any) {
            let message;
            try {
                let body = JSON.parse(error._body);
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

    // Set required headers on the request
    setRequestHeaders() {
        let authToken = this.cognitoService.getIdToken();
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': " " + authToken,
            'Access-Control-Allow-Origin': '*'
        });

        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json',
        //         'Authorization': " " + authToken,
        //         'Access-Control-Allow-Origin': '*'
        //     })
        //   };
          
        this.options = new RequestOptions({ headers: headers });
    }

    // HTTP GET method invocation
    get(url: string) {
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    sendRequestMail(url: string) {
        this.setRequestHeaders();
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    getUserInfo(url: string) {
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    post(url: string){
        this.setRequestHeaders();
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    getPresignedUrl(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    getDownloadUrl(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    getMetadataOfS3Object(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    sendExportRequest(url: string) {
        this.setRequestHeaders();
        console.log("sending request 2 " + ApiGatewayService._API_ENDPOINT + url ) 
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', this.options).pipe(
        map(this.extractData),
        catchError(this.handleError),);
    }

    getDesiredInstanceTypesAndCosts(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }

    modifyUserWorkstation(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options).pipe(
            map(this.extractData),
            catchError(this.handleError),);
    }
}
