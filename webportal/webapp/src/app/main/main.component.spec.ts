import {waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { NavigationEnd, Router, Routes } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let router : Router;
  let mockObjectMap = {};

  const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: MainComponent },
    { path: '**', redirectTo: 'home' }
  ];

  beforeEach(waitForAsync(() => {    
    let mockCognitoAPIService = {
      login: jasmine.createSpy('login')
    }

    mockObjectMap = Object.assign({}, {
    mockCognitoAPIService  
    });
    

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
      ],      
      declarations: [ MainComponent ],
      providers: [
        { provide: CognitoService, useValue: mockCognitoAPIService },
        { provide: APP_BASE_HREF, useValue : '/' }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
   
  it('should test navigationEnd', () => {
    //TestBed.get(Router)
    TestBed.inject(Router)
      .navigate(['/home'])
        .then(() => {
          console.log("##### Test Location ",location);
          expect(location.pathname.endsWith('/context.html')).toBe(true);
        }).catch(e => console.log(e));
  });

  it('should call login', () => {
    component.userLogin();
    expect(mockObjectMap['mockCognitoAPIService'].login).toHaveBeenCalled();
  });

});
