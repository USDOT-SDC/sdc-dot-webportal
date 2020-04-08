import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetinfoComponent } from './datasetinfo.component';

describe('DatasetinfoComponent', () => {
  let component: DatasetinfoComponent;
  let fixture: ComponentFixture<DatasetinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
