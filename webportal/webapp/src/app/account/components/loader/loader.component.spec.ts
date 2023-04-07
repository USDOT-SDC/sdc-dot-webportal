import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderComponent ],
      providers: [LoaderService],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
