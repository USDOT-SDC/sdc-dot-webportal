import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RoutingModule } from '../app.routes';
import { FormsModule } from '@angular/forms';
import { HttpModule, RequestOptions } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { TableModule } from 'primeng/table';
import { FileUploadModule, SharedModule, PanelModule, RadioButtonModule, MessageModule } from 'primeng/primeng';
import { MarkdownModule } from 'ngx-md';
import { ToastyModule } from 'ng2-toasty';
import { MainComponent } from '../main/main.component';
import { HomeComponent } from '../main/home/home.component';
import { AboutComponent } from '../main/about/about.component';
import { DatasetinfoComponent } from '../main/datasetinfo/datasetinfo.component';
import { RegisterComponent } from '../main/register/register.component';
import { HomeFaqComponent } from '../main/faq/faq.component';
import { AccountHomeComponent } from './accounthome/accounthome.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { ExportRequestsComponent } from './exportrequests/exportrequests.component';
import { WorkstationComponent } from './workstation/workstation.component';
import { FaqComponent } from './faq/faq.component';
import { APP_BASE_HREF } from '@angular/common';
import { CognitoService } from '../../services/cognito.service';
import { ApiGatewayService } from '../../services/apigateway.service';
import * as AWS from "aws-sdk-mock";
import { Observable } from 'rxjs/Observable';
import { analyzeAndValidateNgModules } from '@angular/compiler';

describe('AccountComponent', () => {
  let component: AccountComponent;
  //let fixture: ComponentFixture<AccountComponent>;
  let fixture: ComponentFixture<AccountComponent>, service: CognitoService, apiService: ApiGatewayService;
  //let mockAPIService: ApiGatewayService;
  let mockService;
  let mockAPIService;

  beforeEach(async(() => {

    mockService = {
      getUserPool: jasmine.createSpy('getUserPool')
    }

    //mockAPIService = {
    //  getUserInfo: jasmine.createSpy('getUserInfo'),
    //  userLogout: jasmine.createSpy('userLogut')
    //}

    apiService = jasmine.createSpyObj('apiService', ['getUserInfo']);
    //apiService.getUserInfo('user').and.returnValue('bob');;
    //spyOn(mockAPIService, 'getUserInfo').and.returnValue(Promise.resolve(new Observable<{}>()));

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterModule,
        RoutingModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatMenuModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSelectModule,
        MatOptionModule,
        MatRadioModule,
        MatCheckboxModule,
        MatTabsModule,
        CdkTableModule,
        TableModule,
        FileUploadModule,
        SharedModule,
        PanelModule,
        RadioButtonModule,
        MessageModule,
        MarkdownModule.forRoot(),
        ToastyModule.forRoot(),],
      declarations: [
        AccountComponent,
        MainComponent,
        HomeComponent,
        AboutComponent,
        DatasetinfoComponent,
        RegisterComponent,
        HomeFaqComponent,
        AccountHomeComponent,
        DatasetsComponent,
        ExportRequestsComponent,
        WorkstationComponent,
        FaqComponent],
      providers: [
          {provide: APP_BASE_HREF, useValue: '/'},
          {provide: CognitoService//, useValue: mockService
          },
          {provide: ApiGatewayService, useValue: apiService
          }        
        ]
    })
    .compileComponents();
  }));

  

  beforeEach(() => {
    //TODO 
    // 1. figure out how to get the observable to return the response object below.
    // 2. fill in the response object with data for the test.
    // 3. figure out how to mock the sessionStorage to validate that the data from the response gets written into the sessionStorage
    // let response = {
    //   'username': null,
    //   'email': null,
    //   'stacks': null,
    //   'datasets': null,
    //   'roles': null,
    //   'userTrustedStatus': null
    // };
    // let observable = new Observable();
    //response = Observable.create();

    //spyOn(mockAPIService, 'getUserInfo').and.returnValue(observable);
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("tracks that the spy was called", function() {
    expect(apiService.getUserInfo).toHaveBeenCalled();
  });

  it('should create', () => {
    component.getUserInfo();
    expect(component).toBeTruthy();
  });

  it('should call getUserInfo', inject([ApiGatewayService], (service: ApiGatewayService) => {  
    component.getUserInfo();
    spyOn(service, 'getUserInfo');
    expect(service).toBeTruthy();
  }));

  it('should call user logout', inject([CognitoService], (service: CognitoService) => { 
    service.logout;   
    spyOn(service, 'logout');
    expect(service).toBeTruthy();
  }));

  
});
