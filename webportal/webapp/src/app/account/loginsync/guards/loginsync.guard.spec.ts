import { LoginSyncGuard } from './loginsync.guard';
import { CognitoService } from '../../../../services/cognito.service';
import { Router } from '@angular/router';
import { WindowToken } from '../../../../factories/window.factory';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Injector } from '@angular/core';
import { LoginSyncService } from '../services/loginsyncservice.service';


class MockRouter {
  navigate(path) {};
}

const MockWindow = {
  location: {
    _href: '',
    set href(url: string) {
      this._href = url;
    },
    get href() {
      return this._href;
    }
  }
};

class MockCognitoService {
    buildLoginGovRedirectUrl(path) { return 'some_url'; };
}

class MockLoginSyncService {
    userAccountsLinked() {};
}

describe('LoginSyncGuard', () => {
  describe('canActivate', () => {
    let classUnderTest: LoginSyncGuard;
    let cognitoService: CognitoService;
    let mockLoginSyncService;
    let result: Observable<boolean>;
    let mockRouter;
    let mockWindow;
    let mockCognitoService;

    beforeEach(() => {

        const injector = Injector.create({
          providers: [
            { provide: Router, useClass: MockRouter, deps: []},
            { provide: LoginSyncGuard, useClass: LoginSyncGuard, deps: [LoginSyncService, Router, CognitoService, WindowToken]},
            { provide: CognitoService, useClass: MockCognitoService, deps: []},
            { provide: LoginSyncService, useClass: MockLoginSyncService, deps: []},
            { provide: WindowToken, useValue: MockWindow }
          ]
        });
        classUnderTest = injector.get(LoginSyncGuard);
        mockRouter = injector.get(Router);
        mockLoginSyncService = injector.get(LoginSyncService);
        mockCognitoService = injector.get(CognitoService);
        mockWindow = injector.get(WindowToken);
    });

    it('should return true for a user logged in with ADFS creds', () => {
        //spyOn(mockLoginSyncService, 'userAccountsLinked').and.returnValue(Observable.of({ accountLinked: true }));
        spyOn(mockLoginSyncService, 'userAccountsLinked').and.returnValue(of({ accountLinked: true }));
        spyOn(mockRouter, 'navigate');

        result = <Observable<boolean>> classUnderTest.canActivate();

        result.subscribe(observable_result => {
            expect(observable_result).toEqual(true);
            expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
        });
    });

    it('should return false for a user logged in with Login.gov creds', () => {
        //spyOn(mockLoginSyncService, 'userAccountsLinked').and.returnValue(Observable.of({ accountLinked: false }));
        spyOn(mockLoginSyncService, 'userAccountsLinked').and.returnValue(of({ accountLinked: false }));
        spyOn(mockRouter, 'navigate');

        result = <Observable<boolean>> classUnderTest.canActivate();

        result.subscribe(observable_result => {
            expect(observable_result).toEqual(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['account/loginsync']);
        });
    });

    it('should redirect to Login.gov if the user has been migrated', () => {
        spyOn(mockCognitoService, 'buildLoginGovRedirectUrl').and.returnValue('some_url');
        //spyOn(mockLoginSyncService, 'userAccountsLinked').and.returnValue(Observable.of({ accountLinked: false, migratedLegacyUser: true }));
        spyOn(mockLoginSyncService, 'userAccountsLinked').and.returnValue(of({ accountLinked: false, migratedLegacyUser: true }));
        spyOn(mockRouter, 'navigate');

        result = <Observable<boolean>> classUnderTest.canActivate();

        result.subscribe(observable_result => {
            expect(observable_result).toEqual(false);
            expect(mockWindow.location.href).toEqual('some_url');
            expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
        });
    });
  });
});
