import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { CognitoService } from '../../services/cognito.service';
import { ApiGatewayService } from '../../services/apigateway.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';


describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;  
  let mockObjectMap = {};

  let RESPONSE = {
     'username': 'testuser',
     'email': 'testuser@gmail.com',
     'stacks': [{ application: 'Python', instance_id: 'i-1234abc', team_bucket_name: 'dot-sdc-softwares' }],
     'datasets': [{exportWorkflow: 'testuser@gmail.com'}],
     'roles': 'user',
     'userTrustedStatus': { status: 'success' }
  }
 
  const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: AccountComponent },
    { path: '**', redirectTo: 'home' }
  ];

  beforeEach(async() => {

    let mockCognitoService = {
      logout: jasmine.createSpy('logout')
    }
    
    let mockApiGatewayService = jasmine.createSpyObj(ApiGatewayService.name, {'getUserInfo': of(RESPONSE)});

    mockObjectMap = Object.assign({}, {
      mockCognitoService,
      mockApiGatewayService
    });

    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [ AccountComponent ],
      providers: [
          {provide: APP_BASE_HREF, useValue: '/'},
          {provide: CognitoService, useValue: mockCognitoService},
          {provide: ApiGatewayService, useValue: mockApiGatewayService} 
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    let store = {};
    const mockSessionStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
       
    };
    spyOn(sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    spyOn(sessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
    spyOn(sessionStorage, 'removeItem').and.callFake(mockSessionStorage.removeItem);
    spyOn(sessionStorage, 'clear').and.callFake(mockSessionStorage.clear);    
    
    let localStore = {};
    const mockLocalStorage = {
      clear: () => {
        localStore = {};
      }
    };

    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear); 

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  it('should call getUserInfo', () => {
    component.ngOnInit();
    expect(mockObjectMap['mockApiGatewayService'].getUserInfo).toHaveBeenCalled();    
   });

  it('should call logout', () => {
    component.ngOnInit();
    component.userLogout();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(mockObjectMap['mockCognitoService'].logout).toHaveBeenCalled();    
   });
  
});
