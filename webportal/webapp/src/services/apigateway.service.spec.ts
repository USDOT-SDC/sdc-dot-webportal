import { TestBed, inject } from '@angular/core/testing';

import { ApiGatewayService } from './apigateway.service';
import { HttpModule } from '@angular/http';
import { CognitoService } from './cognito.service';

describe('ApiGatewayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ApiGatewayService, CognitoService]
    });
  });

  it('should be created', inject([ApiGatewayService], (service: ApiGatewayService) => {
    expect(service).toBeTruthy();
  }));
});
