import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSyncComponent } from './loginsync.component';

describe('LoginsyncComponent', () => {
  let component: LoginSyncComponent;
  let fixture: ComponentFixture<LoginSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
