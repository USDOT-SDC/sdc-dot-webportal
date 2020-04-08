import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRequestsComponent } from './exportrequests.component';

describe('SettingsComponent', () => {
  let component: ExportRequestsComponent;
  let fixture: ComponentFixture<ExportRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
