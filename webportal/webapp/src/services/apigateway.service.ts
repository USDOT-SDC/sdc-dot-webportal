import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CognitoService } from './cognito.service';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/throw';
import { environment } from '../environments/environment';

@Injectable()
export class ApiGatewayService {

    protected options: RequestOptions;
    private static _API_ENDPOINT = 'https://u2zksemc1h.execute-api.us-east-1.amazonaws.com/api/';

    apiResponse: any;
    extractData: any;
    handleError: any;

    constructor(
        private http: Http,
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
            return Observable.throw(error);
        };
    }

    // Set required headers on the request
    setRequestHeaders() {
        let authToken = this.cognitoService.getIdToken();
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': " " + authToken,
            'Access-Control-Allow-Origin': '*'
        });
        this.options = new RequestOptions({ headers: headers });
    }

    // HTTP GET method invocation
    get(url: string) {
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    sendRequestMail(url: string) {
        this.setRequestHeaders();
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserInfo(url: string) {
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    post(url: string){
        this.setRequestHeaders();
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPresignedUrl(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDownloadUrl(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMetadataOfS3Object(url: string){
        this.setRequestHeaders();
        return this.http.get(ApiGatewayService._API_ENDPOINT + url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    sendExportRequest(url: string) {
        this.setRequestHeaders();
        console.log("sending request 2 " + ApiGatewayService._API_ENDPOINT + url ) 
        return this.http.post(ApiGatewayService._API_ENDPOINT + url, '', this.options)
        .map(this.extractData)
        .catch(this.handleError);
    }
}
