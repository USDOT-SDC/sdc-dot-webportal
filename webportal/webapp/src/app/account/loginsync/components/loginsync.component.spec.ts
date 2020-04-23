import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginSyncComponent } from './loginsync.component';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { CognitoService } from './../../../../services/cognito.service';

describe('LoginsyncComponent', () => {
  let component: LoginSyncComponent;
  let fixture: ComponentFixture<LoginSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [LoginSyncService, HttpClient, HttpHandler, CognitoService],
      declarations: [ LoginSyncComponent ],
      schemas: [NO_ERRORS_SCHEMA]
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
