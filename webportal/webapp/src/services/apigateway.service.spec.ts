import { TestBed, inject } from '@angular/core/testing';

import { ApiGatewayService } from './apigateway.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CognitoService } from './cognito.service';
import { HttpClient } from '@angular/common/http';

describe('ApiGatewayService', () => {
  let httpTestingController: HttpTestingController;
  let service: ApiGatewayService;
  let mockObjectMap = {};

  const mockHttp = {
    request: jasmine.createSpy('request')
  };
  
  beforeEach(() => {    

    let mockCognitoAPIService = {
      getIdToken: jasmine.createSpy('getIdToken')
    }

    mockObjectMap = Object.assign({}, {
    mockCognitoAPIService  
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiGatewayService, 
        { provide: CognitoService, useValue: mockCognitoAPIService },
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ApiGatewayService);
   
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // it('should be created', () => {
  //   console.log("service: ", service);
  //   expect(service).toBeTruthy();
  // });

  // it('should call getExtractDataFunction', () => {
  //   console.log("service: ", service);
  //   service.getExtractDataFunction();    
  // });
  
  // it('should call getHandleErrorFunction', () => {
  //   service.getHandleErrorFunction();    
  // });

  // it('should call setRequestHeaders', () => {
  //   service.setRequestHeaders();
  //   expect(mockObjectMap['mockCognitoAPIService'].getIdToken).toHaveBeenCalled();
  // });
  
  // it('should call sendRequestMail', () => {
  //   const url = 'http:/index.html';
  //   service.sendRequestMail(url);
  // });

  // it('should call getUserInfo', () => {
  //   const url = 'http:/index.html';
  //   service.getUserInfo(url);
  // });
  
});
