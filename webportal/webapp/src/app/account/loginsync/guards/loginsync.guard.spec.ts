import { LoginSyncGuard } from './loginsync.guard';

class MockRouter {
  navigate(path);
}

describe('LoginSyncGuard', () => {
  describe('canActivate', () => {
    let loginGuard: LoginSyncGuard;
    let loginService;
    let router;

    it('should return true for a user logged in with ADFS creds', () => {
      loginService = { userSignedInWithADFSCreds: () => true };
      router = new MockRouter();
      loginGuard = new LoginSyncGuard(loginService, router);

      expect(loginGuard.canActivate()).toEqual(true);
      expect(router.navigate).toHaveBeenCalledWith(['/account/accounthome']);
    });

    it('should return false for a user logged in with Login.gov creds', () => {
      loginService = { userSignedInWithADFSCreds: () => false };
      router = new MockRouter();
      loginGuard = new LoginSyncGuard(loginService, router);

      expect(loginGuard.canActivate()).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/account/loginsync']);
    });
  });
});
