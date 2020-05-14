import { TestBed, inject } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { CognitoService } from './cognito.service';
import { WindowToken } from '../factories/window.factory';

describe('CognitoService', () => {
    let classUnderTest: CognitoService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CognitoService,
                { provide: WindowToken, useValue: MockWindow }
            ]
        }).compileComponents();
        classUnderTest = TestBed.get(CognitoService);
    });

    it('should be created', () => {
        expect(classUnderTest).toBeTruthy();
    });

    it('builds a redirect URL to Login.gov', () => {
        let expectedResult = `https://${environment.APP_DOMAIN}.auth.${environment.REGION}.amazoncognito.com/oauth2/authorize?` +
                              `redirect_uri=${MockWindow.location.origin}/index.html&response_type=token&` +
                              `client_id=${environment.LOGIN_GOV_COGNITO_APP_CLIENT_ID}`;

        let result = classUnderTest.buildLoginGovRedirectUrl();

        expect(result).toEqual(expectedResult);
    });

        it('builds a redirect URL to Login.gov', () => {
        let expectedResult = `https://${environment.APP_DOMAIN}.auth.${environment.REGION}.amazoncognito.com/oauth2/authorize?` +
                              `redirect_uri=${MockWindow.location.origin}/index.html&response_type=token&` +
                              `client_id=${environment.CLIENT_ID}`;

        let result = classUnderTest.buildDoTADRedirectUrl();

        expect(result).toEqual(expectedResult);
    });
});

const MockWindow = {
  location: {
    origin: 'http://localhost:42'
  }
};