import { TestBed, async, inject } from '@angular/core/testing';

import { LoginsyncGuard } from './loginsync.guard';

describe('LoginsyncGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginsyncGuard]
    });
  });

  it('should ...', inject([LoginsyncGuard], (guard: LoginsyncGuard) => {
    expect(guard).toBeTruthy();
  }));
});
