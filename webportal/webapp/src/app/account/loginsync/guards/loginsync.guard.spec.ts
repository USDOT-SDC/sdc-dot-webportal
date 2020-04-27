import { LoginSyncGuard } from './loginsync.guard';
import { CognitoService } from '../../../../services/cognito.service';
import { Observable } from 'rxjs';

class MockRouter {
  navigate(path) {};
}

fdescribe('LoginSyncGuard', () => {
  describe('canActivate', () => {
    let classUnderTest: LoginSyncGuard;
    let cognitoService: CognitoService;
    let loginService;
    let result: Observable<boolean>;
    let router;

    it('should return true for a user logged in with ADFS creds', () => {
        loginService = { userAccountsLinked: () => Observable.of(true) };
        router = new MockRouter();
        spyOn(router, 'navigate');
        classUnderTest = new LoginSyncGuard(loginService, router, cognitoService);

        result = <Observable<boolean>> classUnderTest.canActivate();
        result.subscribe(result => {
            expect(result).toEqual(true);
            expect(router.navigate).toHaveBeenCalledWith(['/account/accounthome']);
        });
    });

    // it('should return false for a user logged in with Login.gov creds', () => {
    //   loginService = { userSignedInWithADFSCreds: () => false };
    //   router = new MockRouter();
    //   loginGuard = new LoginSyncGuard(loginService, router);

    //   expect(loginGuard.canActivate()).toEqual(false);
    //   expect(router.navigate).toHaveBeenCalledWith(['/account/loginsync']);
    // });
  });
});
