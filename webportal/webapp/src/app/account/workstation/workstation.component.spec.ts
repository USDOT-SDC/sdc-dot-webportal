import {ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationComponent } from './workstation.component';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { CognitoService } from '../../../services/cognito.service';
//import { MatSnackBar } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_BASE_HREF } from '@angular/common';
import { of } from 'rxjs/observable/of';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WorkstationComponent', () => {
  let component: WorkstationComponent;
  let fixture: ComponentFixture<WorkstationComponent>;
  let mockObjectMap = {};  

  let RESPONSE = {
     'username': 'testuser',
     'email': 'testuser@gmail.com',
     'stacks': [{ instance_id: 1234, team_bucket_name: 'acrotron', third: 'third' },
                { "application": "Microsoft-R,Rstudio,Python,Microsoft Power BI,SQL Server Management Studio,SQL Workbench,Open Office,Firefox",
                  "configuration": "CPUs:2,Memory(GiB):4",
                  "display_name": "Programming Environment #1 (Small)",
                  "instance_id": "i-05351af0bc8883291",
                  "instance_type": "t2.medium",
                  "team_bucket_name": "dot-sdc-softwares"
                }],
     'datasets': [{exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'SDC platform', filename: 'tempFile1'},
                  {exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'Other platform', filename: 'tempFile2'},
                  {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'SDC platform'},
                  {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'Other SDC platform'}],
     'roles': 'user',
     'userTrustedStatus': { status: 'success' },
     'Items': [],
     'data': "dictionary"
  }

  beforeEach(async() => {

    let mockMatSnackBar = {
      open: jasmine.createSpy('open')
    };

    let mockCognitoService = {
      logout: jasmine.createSpy('getIdToken')
    }  

    let mockApiGatewayService = jasmine.createSpyObj("ApiGatewayService",
      {
        'get': of(RESPONSE),
        'post': of(RESPONSE)
      });

    
    mockObjectMap = Object.assign({}, {
      mockMatSnackBar,
      mockApiGatewayService
    });
    await TestBed.configureTestingModule({
      declarations: [ WorkstationComponent ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: ApiGatewayService, useValue: mockApiGatewayService}, 
        {provide: CognitoService, useValue: mockCognitoService},
        {provide: MatSnackBar, useValue: mockMatSnackBar}
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
    fixture = TestBed.createComponent(WorkstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
