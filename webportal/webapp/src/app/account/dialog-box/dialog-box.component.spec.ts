import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxComponent } from './dialog-box.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { HttpClient, HttpResponse, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

let RESULT = {'message': 'dialog box closed'};

class mockMatDialog {
  open() {
    return {
      afterClosed: () => of(RESULT)
    };
  }
};

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DialogBoxComponent },
  { path: '**', redirectTo: 'home' }
];

fdescribe('DialogBoxComponent', () => {
  let component: DialogBoxComponent;
  let fixture: ComponentFixture<DialogBoxComponent>;
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
     'datasets': [{"ReadmeBucket": "dev-dot-sdc-curated-911061262852-us-east-1", "exportWorkflow": {"WAZE": {"WAZE": {"UpdateDate": "08-06-2018", "ListOfPOC": ["santosh.karla@hitachivantara.com"], "datatypes": {"IRREGULARITY": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "JAM": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "ALERT": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}}, "UsagePolicyDesc": ""}}}, "ReadmePathKey": "data-dictionaries/WAZE-Curated-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains curated waze data", "BucketName": "dev-dot-sdc-curated-911061262852-us-east-1", "Data_Availability_Span": "March 2017 to Present", "Type": "Dataset(Curated)", "Category": "Curated", "Name": "WAZE"}, {"ReadmeBucket": "dev-dot-sdc-curated-911061262852-us-east-1", "exportWorkflow": {"CVP": {"WYDOT": {"UpdateDate": "08-06-2018", "ListOfPOC": ["tony@neaeraconsulting.com", "RKYoung@uwyo.edu", "santosh.karla@reancloud.com", "swarnadee.bapat@reancloud.com"], "datatypes": {"SPEED": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "CRASH": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "CORRIDOR": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "CLOSURES": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "RWIS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "TIM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "COUNT": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "ALERT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "DMS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "BSM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "PIKALERT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "VSL": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}}, "UsagePolicyDesc": ""}, "THEA": {"UpdateDate": "08-06-2018", "ListOfPOC": ["srinivas.nannapaneni@reancloud.com", "akbar.sheik@reancloud.com", "santosh.karla@reancloud.com", "swarnadee.bapat@reancloud.com"], "datatypes": {"BSM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "SPAT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "Notify"}}}, "UsagePolicyDesc": ""}}}, "ReadmePathKey": "data-dictionaries/WAZE-Curated-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains CVP evaluation datasets", "BucketName": "dev-dot-sdc-curated-911061262852-us-east-1", "Data_Availability_Span": "March 2017 to Present", "Type": "Dataset(Curated)", "Category": "Curated", "Name": "CVP"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "SDC platform", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Algorithm", "Name": "federationmetadata.xml"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "Anusha Gupta", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Dataset", "Category": "Raw", "Name": "federationmetadata.xml"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "Anusha Gupta", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Algorithm", "Name": "test-algorithm"}, {"exportWorkflow": {"ATRI": {"ATRI": {"UpdateDate": "09-24-2019", "ListOfPOC": ["sunje.hwang.ctr@dot.gov", "giridhar.jagathapurao@hitachivantara.com"], "datatypes": {"TRUCK_GPS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}}, "UsagePolicyDesc": ""}}}, "ReadmeBucket": "dev-dot-sdc-raw-submissions-911061262852-us-east-1", "ReadmePathKey": "btsffa/atri/data-dictionaries/ATRI-TruckGPS-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains TRUCK GPS datasets from the American Transportation Research Institute (ATRI)", "BucketName": "dev-dot-sdc-raw-submissions-911061262852-us-east-1", "Data_Availability_Span": "October 2018 to Present", "Type": "Dataset(Raw)", "Category": "Raw", "Name": "ATRI"}, {"Programming_tool": "Python", "ReadmeBucket": "dev-dot-sdc-published-911061262852-us-east-1", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "SDC platform", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Type": "Dataset", "Category": "Published", "Name": "federationmetadata.py"}],
     'roles': 'user',
     'userTrustedStatus': { status: 'success' },
     'Items': [],
     'data': "dictionary"
  }
  let mockMatSnackBar = {
    open: jasmine.createSpy('open')
  };
        
  let mockApiGatewayService = jasmine.createSpyObj(ApiGatewayService.name,
    {
      'sendRequestMail': of(RESPONSE),
      'sendExportRequest': of(RESPONSE),
      'getPresignedUrl': of(RESPONSE)
    });

    const mockHttp = {
      request: jasmine.createSpy('request')
    };

    
  
  mockObjectMap = Object.assign({}, {
    mockMatSnackBar,
    mockMatDialog,
    mockApiGatewayService,
    mockHttp
  });

  const dialogMock = {
    close: () => { }
   };

  beforeEach(async(() => {

    let mockMatDialogRef = {
      close: jasmine.createSpy('close')
    };


    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes(routes),
        MatDialogModule,
        HttpClientTestingModule ],
      declarations: [ DialogBoxComponent ],
      schemas: [ NO_ERRORS_SCHEMA],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: ApiGatewayService, useValue: mockApiGatewayService}, 
        {provide: MatSnackBar, useValue: mockMatSnackBar},
        {provide: MatDialogRef, useValue: dialogMock },
        {provide: MAT_DIALOG_DATA, useValue: {} // Add any data you wish to test if it is passed/used correctly
        },
        {provide: HttpClient, useValue: mockHttp }
      ]
    })
    .compileComponents();
  }));

  

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
    
    let trustedStatus: string;
    trustedStatus =  JSON.stringify({ status: 'success' });
    sessionStorage.setItem('userTrustedStatus', trustedStatus);
    let datasetsString: string;    
    let datasets = [{"ReadmeBucket": "dev-dot-sdc-curated-911061262852-us-east-1", "exportWorkflow": {"WAZE": {"WAZE": {"UpdateDate": "08-06-2018", "ListOfPOC": ["santosh.karla@hitachivantara.com"], "datatypes": {"IRREGULARITY": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "JAM": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "ALERT": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}}, "UsagePolicyDesc": ""}}}, "ReadmePathKey": "data-dictionaries/WAZE-Curated-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains curated waze data", "BucketName": "dev-dot-sdc-curated-911061262852-us-east-1", "Data_Availability_Span": "March 2017 to Present", "Type": "Dataset(Curated)", "Category": "Curated", "Name": "WAZE"}, {"ReadmeBucket": "dev-dot-sdc-curated-911061262852-us-east-1", "exportWorkflow": {"CVP": {"WYDOT": {"UpdateDate": "08-06-2018", "ListOfPOC": ["tony@neaeraconsulting.com", "RKYoung@uwyo.edu", "santosh.karla@reancloud.com", "swarnadee.bapat@reancloud.com"], "datatypes": {"SPEED": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "CRASH": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "CORRIDOR": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "CLOSURES": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "RWIS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "TIM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "COUNT": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "ALERT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "DMS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "BSM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "PIKALERT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "VSL": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}}, "UsagePolicyDesc": ""}, "THEA": {"UpdateDate": "08-06-2018", "ListOfPOC": ["srinivas.nannapaneni@reancloud.com", "akbar.sheik@reancloud.com", "santosh.karla@reancloud.com", "swarnadee.bapat@reancloud.com"], "datatypes": {"BSM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "SPAT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "Notify"}}}, "UsagePolicyDesc": ""}}}, "ReadmePathKey": "data-dictionaries/WAZE-Curated-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains CVP evaluation datasets", "BucketName": "dev-dot-sdc-curated-911061262852-us-east-1", "Data_Availability_Span": "March 2017 to Present", "Type": "Dataset(Curated)", "Category": "Curated", "Name": "CVP"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "SDC platform", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Algorithm", "Name": "federationmetadata.xml"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "Anusha Gupta", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Dataset", "Category": "Raw", "Name": "federationmetadata.xml"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "Anusha Gupta", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Algorithm", "Name": "test-algorithm"}, {"exportWorkflow": {"ATRI": {"ATRI": {"UpdateDate": "09-24-2019", "ListOfPOC": ["sunje.hwang.ctr@dot.gov", "giridhar.jagathapurao@hitachivantara.com"], "datatypes": {"TRUCK_GPS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}}, "UsagePolicyDesc": ""}}}, "ReadmeBucket": "dev-dot-sdc-raw-submissions-911061262852-us-east-1", "ReadmePathKey": "btsffa/atri/data-dictionaries/ATRI-TruckGPS-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains TRUCK GPS datasets from the American Transportation Research Institute (ATRI)", "BucketName": "dev-dot-sdc-raw-submissions-911061262852-us-east-1", "Data_Availability_Span": "October 2018 to Present", "Type": "Dataset(Raw)", "Category": "Raw", "Name": "ATRI"}, {"Programming_tool": "Python", "ReadmeBucket": "dev-dot-sdc-published-911061262852-us-east-1", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "SDC platform", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Type": "Dataset", "Category": "Published", "Name": "federationmetadata.py"}];
    datasetsString = JSON.stringify(datasets);
    sessionStorage.setItem('datasets', datasetsString);
    
    fixture = TestBed.createComponent(DialogBoxComponent);
    component = fixture.componentInstance;
    component.exportWorkflow = datasets;
    fixture.detectChanges();
  });

  it('should create', () => {  
    expect(component).toBeTruthy();
  });
 
  it('dialog should be closed after onNoClick()', () => {
    let spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.onNoClick();
    expect(spy).toHaveBeenCalled();    
  });

  it('should call ngOnInit and set up export and datasettypes array', () => { 
    component.ngOnInit(); 
    expect(component.export.length).toBeGreaterThan(0);
  });

  it('should trigger event to setDataProviders', () => {
    component.ngOnInit();
    expect(component.exportWorkflow).toBeTruthy();
    let event = {value: 'WAZE'};    
    let spy = spyOn(component, 'setDataProviders').and.callThrough();    
    component.setDataProviders(event);
    expect(spy).toHaveBeenCalled();
    expect(component.exportWorkflow.length).toBeGreaterThan(0);
 
  });

  it('should trigger event to setSubDatasets', () => {
    component.ngOnInit();
    expect(component.exportWorkflow).toBeTruthy();
    component.allProvidersJson = {WAZE: {UpdateDate: "08-06-2019", datatypes: { a: 'a', b: 'b', c: 'c'}}} 
    let event = {value: 'WAZE'};    
    let spy = spyOn(component, 'setSubDatasets').and.callThrough();    
    component.setSubDatasets(event);
    expect(spy).toHaveBeenCalled();
 
   });
  
  it('should set selectedIndex to 0', () => {
    component.selectedIndexChange(0);    
    expect(component.selectedIndex).toEqual(0); 
  });

  it('should set selectedIndex to 1', () => {
    component.onSelectionOfDataset();    
    expect(component.selectedIndex).toEqual(1); 
  });
    
  it('should set selectedIndex to 2', () => {
    component.onApprovalformClick();    
    expect(component.selectedIndex).toEqual(2); 
  });

  it('should validate email to true', () => {     
    expect(component.validateEmailRegex('cheryl.rousseau@gmail.com')).toBeTruthy();
  });

  it('should validate email to false', () => {     
    expect(component.validateEmailRegex('cheryl.rousseau')).toBeFalsy();
  });

  it('should send mail if datasetName not equal to CVP', () => {   
    component.mailType = "Access Request Mail" ;
    component.datasetName = "Waze"; 
    component.sendMail();
    expect(mockObjectMap['mockApiGatewayService'].sendRequestMail).toHaveBeenCalled(); 
  });

  it('should send mail if datasetName equal to CVP', () => {   
    component.mailType = "Access Request Mail" ;
    component.datasetName = "U.S DOT Connected Vehicle Pilot (CVP) Evaluation Datasets"; 
    component.sendMail();
    expect(mockObjectMap['mockApiGatewayService'].sendRequestMail).toHaveBeenCalled(); 
  });

  it('should send mail if datasetName not equal to CVP', () => {   
    component.mailType = "Access Request Mail" ;
    component.datasetName = "U.S DOT Connected Vehicle Pilot (CVP) Evaluation Datasets"; 
    component.sendMail();
    expect(mockObjectMap['mockApiGatewayService'].sendRequestMail).toHaveBeenCalled(); 
  });

  it('should send mail if type equals dataset', () => {   
    component.messageModel.type = 'dataset';
    component.sendMail();
    expect(mockObjectMap['mockApiGatewayService'].sendRequestMail).toHaveBeenCalled(); 
  });

  it('should send mail if type equals algorithm', () => {   
    component.messageModel.type = 'algorithm';
    component.sendMail();
    expect(mockObjectMap['mockApiGatewayService'].sendRequestMail).toHaveBeenCalled(); 
  });

 
  it('should submit export request with trustedRequest set to Yes', () => {   
    component.messageModel.datasettype = "algorithm";
    component.messageModel.dataProviderName = "CVP";
    component.messageModel.subDataSet = "THEA";
    component.derivedDataSetName = "CVP";
    component.dataSources = 'dataSources';
    component.derivedDataSet = 'derivedDataSet';
    component.detailedDerivedDataset = 'detailedDD';
    component.tags = 'tags';
    component.justifyExport = 'justify';
    component.trustedRequest = 'Yes';
    component.acceptableUse = 'Decline';
    component.submitRequest();
    expect(mockObjectMap['mockApiGatewayService'].sendExportRequest).toHaveBeenCalled(); 
  });

  it('should submit export request with trustedRequest set to No', () => {   
    component.messageModel.datasettype = "algorithm";
    component.messageModel.dataProviderName = "CVP";
    component.messageModel.subDataSet = "THEA";
    component.derivedDataSetName = "CVP";
    component.dataSources = 'dataSources';
    component.derivedDataSet = 'derivedDataSet';
    component.detailedDerivedDataset = 'detailedDD';
    component.tags = 'tags';
    component.justifyExport = 'justify';
    component.trustedRequest = 'No';
    component.acceptableUse = 'Decline';
    component.submitRequest();
    expect(mockObjectMap['mockApiGatewayService'].sendExportRequest).toHaveBeenCalled(); 
  });
 
  it('should set selected value to Yes', () => {   
    component.onTrustedRequestGrpChange('Yes');
    expect(component.trustedRequest).toEqual('Yes'); 
  });

  it('should not set selected value to Yes', () => {   
    component.onTrustedRequestGrpChange('No');
    expect(component.trustedRequest).toEqual('No'); 
  });

  it('should trigger event to upload files', () => {
    mockHttp.request.and.returnValue(
      of({ type: HttpEventType.UploadProgress, loaded: 7, total: 10 } as HttpProgressEvent)
    );
    component.ngOnInit();
    let event1 = { 'files': [{"name": "tmp.1"} ,{"name": "tmp.2"}]};       
    let spy = spyOn(component, 'uploadFiles').and.callThrough();    
    component.uploadFiles(event1);
    expect(spy).toHaveBeenCalled();
    expect(mockObjectMap['mockHttp'].request).toHaveBeenCalled(); 
   });
});
