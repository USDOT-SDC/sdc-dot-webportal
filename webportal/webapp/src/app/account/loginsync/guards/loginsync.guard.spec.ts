import { LoginSyncGuard } from './loginsync.guard';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operator/map';
// import { LoginSyncService } from '../services/loginsyncservice.service';

class MockRouter {
  navigate(path) {}
}

fdescribe('LoginSyncGuard', () => {
  describe('canActivate', () => {
    let loginGuard: LoginSyncGuard;
    let loginService;
    let router;

    it('should return true for a user with linked accounts', () => {
      loginService = { userAccountsLinked: () => Observable.of({ 'accountLinked': true }) };
      router = new MockRouter();
      loginGuard = new LoginSyncGuard(loginService, router);
      spyOn(router, 'navigate');

      expect(loginGuard.canActivate()).toEqual(true);
    });

    it('should return false for a user with unlinked accounts', () => {
      loginService = { userAccountsLinked: () => Observable.of({ 'accountLinked': false }) };
      router = new MockRouter();
      loginGuard = new LoginSyncGuard(loginService, router);
      spyOn(router, 'navigate');

      expect(loginGuard.canActivate()).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['account/loginsync']);
    });
  });
});
