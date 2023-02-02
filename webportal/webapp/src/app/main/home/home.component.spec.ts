import {waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../../services/cognito.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  
  let mockObjectMap = {};
     
  beforeEach(waitForAsync(() => {
    let mockCognitoAPIService = {
      onLoad: jasmine.createSpy('onLoad'),
      isUserSessionActive: jasmine.createSpy('isUserSessionActive'),
    }

    let router = {
      navigate: jasmine.createSpy('navigate')
    }
    
    mockObjectMap = Object.assign({}, {
      mockCognitoAPIService,
      router
    });

    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: CognitoService, useValue: mockCognitoAPIService },
        { provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get current url', () => {
    spyOn(component, 'getCurrentURL').and.returnValue('http://test.html/?access_token=1');
    expect(component.getCurrentURL()).toEqual('http://test.html/?access_token=1');
  });

  
  it('should find access token in url', () => {
    spyOn(component, 'getCurrentURL').and.returnValue('http://test.html/?access_token=1');       
    component.ngOnInit();  
    expect(mockObjectMap['mockCognitoAPIService'].onLoad).toHaveBeenCalled();
    expect(mockObjectMap['router'].navigate).toHaveBeenCalledWith(['account']);
  });

  it('should not find access token in url', () => {
    spyOn(component, 'getCurrentURL').and.returnValue('http://test.html/?token=1');       
    component.ngOnInit();  
    expect(mockObjectMap['mockCognitoAPIService'].onLoad).toHaveBeenCalledTimes(0);
    expect(mockObjectMap['router'].navigate).toHaveBeenCalledTimes(0);
  });
  
  it('should log user is authenticated', () => {
    component.isLoggedIn('some message', true);
    expect(mockObjectMap['router'].navigate).toHaveBeenCalledWith(['account']);
  });

  it('should log user is not authenticated', () => {
    component.isLoggedIn('some message', false);
    expect(mockObjectMap['router'].navigate).toHaveBeenCalledTimes(0);
  });
  
});
