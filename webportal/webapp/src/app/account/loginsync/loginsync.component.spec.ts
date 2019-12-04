import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginsyncComponent } from './loginsync.component';

describe('LoginsyncComponent', () => {
  let component: LoginsyncComponent;
  let fixture: ComponentFixture<LoginsyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginsyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
