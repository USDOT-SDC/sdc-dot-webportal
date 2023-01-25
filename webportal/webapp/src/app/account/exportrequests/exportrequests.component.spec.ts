import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRequestsComponent } from './exportrequests.component';
import { of } from 'rxjs/observable/of';
import { ApiGatewayService } from '../../../services/apigateway.service';
//import { MatDialogModule, MatSnackBar, MatDialog } from '@angular/material';
import { MatDialogModule,  MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let RESULT = {'message': 'dialog box closed'};

class mockMatDialog {
  open() {
    return {
      afterClosed: () => of(RESULT)
    };
  }
};

let dialog: mockMatDialog;

// // These response formats appear to be unused
// let RESPONSE1 = {
//   'username': 'testuser',
//   'email': 'testuser@gmail.com',
//   'stacks': [{ instance_id: 1234, team_bucket_name: 'acrotron', third: 'third' },
//              { "application": "Microsoft-R,Rstudio,Python,Microsoft Power BI,SQL Server Management Studio,SQL Workbench,Open Office,Firefox",
//                "configuration": "CPUs:2,Memory(GiB):4",
//                "display_name": "Programming Environment #1 (Small)",
//                "instance_id": "i-05351af0bc8883291",
//                "instance_type": "t2.medium",
//                "team_bucket_name": "dot-sdc-softwares"
//              }],
//   'datasets': [{"ReadmeBucket": "dev-dot-sdc-curated-911061262852-us-east-1", "exportWorkflow": {"WAZE": {"WAZE": {"UpdateDate": "08-06-2018", "ListOfPOC": ["santosh.karla@hitachivantara.com"], "datatypes": {"IRREGULARITY": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "JAM": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "ALERT": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}}, "UsagePolicyDesc": ""}}}, "ReadmePathKey": "data-dictionaries/WAZE-Curated-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains curated waze data", "BucketName": "dev-dot-sdc-curated-911061262852-us-east-1", "Data_Availability_Span": "March 2017 to Present", "Type": "Dataset(Curated)", "Category": "Curated", "Name": "WAZE"}, {"ReadmeBucket": "dev-dot-sdc-curated-911061262852-us-east-1", "exportWorkflow": {"CVP": {"WYDOT": {"UpdateDate": "08-06-2018", "ListOfPOC": ["tony@neaeraconsulting.com", "RKYoung@uwyo.edu", "santosh.karla@reancloud.com", "swarnadee.bapat@reancloud.com"], "datatypes": {"SPEED": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "CRASH": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "CORRIDOR": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "CLOSURES": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "RWIS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "TIM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "COUNT": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "ALERT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "DMS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}, "BSM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "PIKALERT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "VSL": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "Notify"}}}, "UsagePolicyDesc": ""}, "THEA": {"UpdateDate": "08-06-2018", "ListOfPOC": ["srinivas.nannapaneni@reancloud.com", "akbar.sheik@reancloud.com", "santosh.karla@reancloud.com", "swarnadee.bapat@reancloud.com"], "datatypes": {"BSM": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}, "SPAT": {"Trusted": {"WorkflowStatus": "NotifyReview"}, "NonTrusted": {"WorkflowStatus": "Notify"}}}, "UsagePolicyDesc": ""}}}, "ReadmePathKey": "data-dictionaries/WAZE-Curated-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains CVP evaluation datasets", "BucketName": "dev-dot-sdc-curated-911061262852-us-east-1", "Data_Availability_Span": "March 2017 to Present", "Type": "Dataset(Curated)", "Category": "Curated", "Name": "CVP"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "SDC platform", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Algorithm", "Name": "federationmetadata.xml"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "Anusha Gupta", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Dataset", "Category": "Raw", "Name": "federationmetadata.xml"}, {"ReadmeBucket": "README.md", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "Anusha Gupta", "Geographic_Scope": "US", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Data_Availability_Span": "From March 2013 to present", "Type": "Algorithm", "Name": "test-algorithm"}, {"exportWorkflow": {"ATRI": {"ATRI": {"UpdateDate": "09-24-2019", "ListOfPOC": ["sunje.hwang.ctr@dot.gov", "giridhar.jagathapurao@hitachivantara.com"], "datatypes": {"TRUCK_GPS": {"Trusted": {"WorkflowStatus": "Notify"}, "NonTrusted": {"WorkflowStatus": "NotifyReview"}}}, "UsagePolicyDesc": ""}}}, "ReadmeBucket": "dev-dot-sdc-raw-submissions-911061262852-us-east-1", "ReadmePathKey": "btsffa/atri/data-dictionaries/ATRI-TruckGPS-dictionary.README.md", "Owner": "SDC platform", "Geographic_Scope": "All states in US", "Description": "Contains TRUCK GPS datasets from the American Transportation Research Institute (ATRI)", "BucketName": "dev-dot-sdc-raw-submissions-911061262852-us-east-1", "Data_Availability_Span": "October 2018 to Present", "Type": "Dataset(Raw)", "Category": "Raw", "Name": "ATRI"}, {"Programming_tool": "Python", "ReadmeBucket": "dev-dot-sdc-published-911061262852-us-east-1", "ReadmePathKey": "pallavi/datasets/README.md", "Owner": "SDC platform", "Description": "federation", "BucketName": "dev-dot-sdc-published-911061262852-us-east-1", "Type": "Dataset", "Category": "Published", "Name": "federationmetadata.py"}],
//   'roles': 'user',
//   'userTrustedStatus': { status: 'success' },
//   'Items': [],
//   'data': "dictionary"
// };

// let RESPONSE2 = { 'exportRequests': [{"exportWorkflow":"WAZE","Type":"Algorithm","Owner":"SDC platform","filename":"tempFile1"},
// {"exportWorkflow":"testuser@gmail.com","Type":"Algorithm","Owner":"Other platform","filename":"tempFile2"},
// {"exportWorkflow":"testuser@gmail.com","Type":"Other Algorithm","Owner":"SDC platform"},{"exportWorkflow":"testuser@gmail.com","Type":"Other Algorithm","Owner":"Other SDC platform"}] };

let RESPONSE = [ {'userFullName' : 'Cheryl Rousseau',
                   'description': "Test dummy description",
                   'team': "team bucket 1",
                   'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
                   'RequestedBy_Epoch': 'request by ',
                   'S3Key' : 'S3 key',
                   'TeamBucket' : 'team bucket',
                   'RequestReviewStatus': 'review status',
                   'ReqReceivedTimestamp' : 'recd time stamp',
                   'UserEmail': 'crousseau@acrotron.com',
                   'TeamName': 'team name',
                   'ReqReceivedDate': 'req recd data'},
                   {'userFullName' : 'Cheryl Rousseau', 
                   'description': "Test dummy description", 
                   'team': "team bucket 1",
                   'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
                   'RequestedBy_Epoch': 'request by ',
                   'S3Key' : 'S3 key',
                   'TeamBucket' : 'team bucket',
                   'RequestReviewStatus': 'review status',
                   'ReqReceivedTimestamp' : 'recd time stamp',
                   'UserEmail': 'crousseau@acrotron.com',
                   'TeamName': 'team name',
                   'ReqReceivedDate': 'req recd data'}];

let RESPONSE3 = {
                  'exportRequests': {
                    'tableRequests': [
                      { 'S3Key':'S3 Key',
                        'RequestType':'Table',
                        'S3KeyHash':'team.internal-schema.tablename',
                        'ReqReceivedDate':'req recd data',
                        'TargetDatabaseSchema':'edgetargetdatabase',
                        'TableName':'table-name-data',
                        'ApprovalForm': {'justifyExport':'justify export data'},
                        'RequestedBy':'crousseau',
                        'RequestReviewStatus':'review status',
                        'Dataset-DataProvider-Datatype':'Acme Project/Dataset-Acme Data Provider-Acme Subdataset/Data Type',
                        'TableSchema':'root\n |-- attribute1: str \n |-- attribute2: str \n',
                        'ListOfPOC':['crousseau@acrotron.com'],
                        'DatabaseName':'sdc-support',
                        'UserEmail':'crousseau@acrotron.com',
                        'SourceDatabaseSchema':'internal-schema',
                        'ReqReceivedTimestamp':1664241745.0,
                        'TeamBucket':'',
                        'RequestedBy_Epoch':'crousseau_1664241745' },
                      { 'S3Key':'S3 Key',
                        'RequestType':'Table',
                        'S3KeyHash':'team.internal-schema.tablename2',
                        'ReqReceivedDate':'req recd data2',
                        'TargetDatabaseSchema':'edgetargetdatabase2',
                        'TableName':'table-name-data2',
                        'ApprovalForm': {'justifyExport':'justify export data2'},
                        'RequestedBy':'crousseau',
                        'RequestReviewStatus':'review status',
                        'Dataset-DataProvider-Datatype':'Acme Project/Dataset-Acme Data Provider-Acme Subdataset/Data Type',
                        'TableSchema':'root\n |-- attribute12: str \n |-- attribute22: str \n',
                        'ListOfPOC':['crousseau@acrotron.com'],
                        'DatabaseName':'sdc-support',
                        'UserEmail':'c.m.fitzgerald.ctr@dot.gov',
                        'SourceDatabaseSchema':'internal-schema',
                        'ReqReceivedTimestamp':1664241746.0,
                        'TeamBucket':'',
                        'RequestedBy_Epoch':'crousseau_1664241746' }
                       ],           
                    's3Requests':[
                      { 'S3Key': 'S3 key',
                        'S3KeyHash': '12345',
                        'ReqReceivedDate': 'req recd data',
                        'dataset': 'Waze Alert',
                        'UserEmail': 'crousseau@acrotron.com',
                        'ApprovalForm': {'justifyExport': 'justifyExport data'},
                        'RequestBy': 'Cheryl Rousseau',
                        'ReqReceivedTimestamp' : 'recd time stamp',
                        'TeamBucket' : 'team bucket',
                        'RequestReviewStatus': 'review status',
                        'RequestedBy_Epoch': 'request by ',
                        'description': 'Test dummy description',
                        'team': 'team bucket 1',
                        'details': 'Details',
                        'reviewFile': 'review file',
                        'TeamName': 'team name' },
                      { 'S3Key': 'S3 key',
                        'S3KeyHash': '12346',
                        'ReqReceivedDate': 'req recd data',
                        'dataset': 'Waze Alert',
                        'UserEmail': 'crousseau@acrotron.com',
                        'ApprovalForm': {'justifyExport': 'justifyExport data'},
                        'RequestBy': 'Cheryl Rousseau',
                        'ReqReceivedTimestamp' : 'recd time stamp',
                        'TeamBucket' : 'team bucket',
                        'RequestReviewStatus': 'review status',
                        'RequestedBy_Epoch': 'request by ',
                        'description': 'Test dummy description2',
                        'team': 'team bucket 2',
                        'details': 'Details',
                        'reviewFile': 'review file',
                        'TeamName': 'team name' }
                      ]
                    },
                  'trustedRequests': [
                    [{  'UserID':'crousseau',
                        'Dataset-DataProvider-Datatype':'Acme Project/Dataset-Acme Data Provider-Acme Subdataset/Data Type',
                        'UserEmail':'cfitzgeral@acrotron.com',
                        'UsagePolicyStatus':'Accept',
                        'ReqReceivedTimestamp':1650597609.0,
                        'TrustedStatus':'Untrusted',
                        'LastUpdatedTimestamp':'20220422',
                        'TrustedJustification':'Test Trusted Justification data'}],
                    [{  'UserID':'crousseau',
                        'Dataset-DataProvider-Datatype':'Acme Project/Dataset-Acme Data Provider-Acme Subdataset/Data Type2',
                        'UserEmail':'cfitzgeral@acrotron.com',
                        'UsagePolicyStatus':'Accept',
                        'ReqReceivedTimestamp':1650597610.0,
                        'TrustedStatus':'Untrusted',
                        'LastUpdatedTimestamp':'20220422',
                        'TrustedJustification':'Test Trusted Justification data2'} ]
                    ],
                  'autoExportRequests': [
                    [{  'UserID':'crousseau',
                        'Dataset-DataProvider-Datatype':'ACME-Dataset-Datatype',
                        'UserEmail':'crousseau@acrotron.com',
                        'Justification':'Test',
                        'LastUpdatedTime':'20220113',
                        'AutoExportStatus':'Approved',
                        'ReqReceivedTime':1642096141.0  }
                    ],
                    [{  'UserID': 'John Smith',
                        'Dataset-DataProvider-Datatype': 'ACME-Dataset-Datatype',
                        'UserEmail': 'crousseau@acrotron.com',
                        'Justification':'Test Justify2', 
                        'LastUpdatedTime':'20220113',
                        'AutoExportStatus':'Approved',
                        'ReqReceivedTime':1642096142.0  }]
                   ]
                 };
                          
// let RESPONSE3 = { 'exportRequests': [
//                    {'WAZE': [ {'userFullName' : 'Cheryl Rousseau', 'description': "Test dummy description", 'team': "team bucket 1",
//                     'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                      'RequestedBy_Epoch': 'request by ',
//                      'S3Key' : 'S3 key',
//                      'TeamBucket' : 'team bucket',
//                      'RequestReviewStatus': 'review status',
//                      'ReqReceivedTimestamp' : 'recd time stamp',
//                      'UserEmail': 'crousseau@acrotron.com',
//                      'TeamName': 'team name',
//                      'ReqReceivedDate': 'req recd data',
//                      'ApprovalForm': {'justifyExport': 'justifyExport'}},
//                      {'userFullName' : 'John Smith', 'description': "Test dummy description", 'team': "team bucket 1",
//                     'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                      'RequestedBy_Epoch': 'request by ',
//                      'S3Key' : 'S3 key',
//                      'TeamBucket' : 'team bucket',
//                      'RequestReviewStatus': 'review status',
//                      'ReqReceivedTimestamp' : 'recd time stamp',
//                      'UserEmail': 'crousseau@acrotron.com',
//                      'TeamName': 'team name',
//                      'ReqReceivedDate': 'req recd data',
//                      'ApprovalForm': {'justifyExport' : 'justifyExport'}},
//                     ]
//                   },

//                 { 'CVP': [ {'userFullName' : 'Cheryl Rousseau', 'description': "Test dummy description", 'team': "team bucket 1",
//                     'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                      'RequestedBy_Epoch': 'request by ',
//                      'S3Key' : 'S3 key',
//                      'TeamBucket' : 'team bucket',
//                      'RequestReviewStatus': 'review status',
//                      'ReqReceivedTimestamp' : 'recd time stamp',
//                      'UserEmail': 'crousseau@acrotron.com',
//                      'TeamName': 'team name',
//                      'ReqReceivedDate': 'req recd data',
//                      'ApprovalForm': {'justifyExport': 'justifyExport'}},
//                      {'userFullName' : 'John Smith', 'description': "Test dummy description", 'team': "team bucket 1",
//                     'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                      'RequestedBy_Epoch': 'request by ',
//                      'S3Key' : 'S3 key',
//                      'TeamBucket' : 'team bucket',
//                      'RequestReviewStatus': 'review status',
//                      'ReqReceivedTimestamp' : 'recd time stamp',
//                      'UserEmail': 'crousseau@acrotron.com',
//                      'TeamName': 'team name',
//                      'ReqReceivedDate': 'req recd data',
//                      'ApprovalForm': {'justifyExport' : 'justifyExport'}},
//                     ]
//                   }
//                 ],
//                 'trustedRequests': [
//                       {'userFullName' : 'Cheryl Rousseau', 'description': "Test dummy description", 'team': "team bucket 1",
//                        'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                         'RequestedBy_Epoch': 'request by ',
//                         'S3Key' : 'S3 key',
//                         'TeamBucket' : 'team bucket',
//                         'RequestReviewStatus': 'review status',
//                         'ReqReceivedTimestamp' : 'recd time stamp',
//                         'UserEmail': 'crousseau@acrotron.com',
//                         'TeamName': 'team name',
//                         'ReqReceivedDate': 'req recd data'},
//                         {'userFullName' : 'John Smith', 'description': "Test dummy description", 'team': "team bucket 1",
//                        'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                         'RequestedBy_Epoch': 'request by ',
//                         'S3Key' : 'S3 key',
//                         'TeamBucket' : 'team bucket',
//                         'RequestReviewStatus': 'review status',
//                         'ReqReceivedTimestamp' : 'recd time stamp',
//                         'UserEmail': 'crousseau@acrotron.com',
//                         'TeamName': 'team name',
//                         'ReqReceivedDate': 'req recd data'}
//                   ],
//                   'autoExportRequests': [
//                     {'userFullName' : 'Cheryl Rousseau', 'description': "Test dummy description", 'team': "team bucket 1",
//                        'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                         'RequestedBy_Epoch': 'request by ',
//                         'S3Key' : 'S3 key',
//                         'TeamBucket' : 'team bucket',
//                         'RequestReviewStatus': 'review status',
//                         'ReqReceivedTimestamp' : 'recd time stamp',
//                         'UserEmail': 'crousseau@acrotron.com',
//                         'TeamName': 'team name',
//                         'ReqReceivedDate': 'req recd data'},
//                         {'userFullName' : 'John Smith', 'description': "Test dummy description", 'team': "team bucket 1",
//                        'dataset': "Waze Alert", 'details': 'Details', 'reviewFile': 'review file', 'S3KeyHash': '12345',
//                         'RequestedBy_Epoch': 'request by ',
//                         'S3Key' : 'S3 key',
//                         'TeamBucket' : 'team bucket',
//                         'RequestReviewStatus': 'review status',
//                         'ReqReceivedTimestamp' : 'recd time stamp',
//                         'UserEmail': 'crousseau@acrotron.com',
//                         'TeamName': 'team name',
//                         'ReqReceivedDate': 'req recd data'}
//                   ]
//                   }

describe('ExportRequestsComponent', () => {
  let component: ExportRequestsComponent;
  let fixture: ComponentFixture<ExportRequestsComponent>;
  let mockObjectMap = {};  

  let mockMatSnackBar = {
    open: jasmine.createSpy('open')
  };
        
  let mockApiGatewayService = jasmine.createSpyObj(ApiGatewayService.name,
    {
      'post': of(RESPONSE3),
      'getDownloadUrl': of(RESPONSE)
    });

    mockObjectMap = Object.assign({}, {
      mockMatSnackBar,
      mockMatDialog,
      mockApiGatewayService
    });
  
    const dialogMock = {
      open: () => { }
     };

     let dialogSpy: jasmine.Spy;
     let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
     dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...
   
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      schemas: [ NO_ERRORS_SCHEMA],
      declarations: [ ExportRequestsComponent ],
      providers: [
        {provide: ApiGatewayService, useValue: mockApiGatewayService}, 
        {provide: MatSnackBar, useValue: mockMatSnackBar} ]
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
   
    sessionStorage.setItem('email', 'crousseau@acrotron.com');
    sessionStorage.setItem('username', 'crousseau');

    fixture = TestBed.createComponent(ExportRequestsComponent);
    component = fixture.componentInstance;
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
  
  // it('should call ngOnInit and get export file requests', () => { 
  //   component.ngOnInit(); 
  //   expect(component.exportFileRequests.length).toBeGreaterThan(0);
  // });

  it('should call ngOnInit and call api gateway service export requests', () => { 
    component.ngOnInit(); 
    expect(mockObjectMap['mockApiGatewayService'].post).toHaveBeenCalled(); 
  });


  it('should open and close renderApprovalForm dialog box', () => {
    let approvalForm = {'s3Requests':[{ 'ApprovalForm': {'justifyExport' : 'justifyExport'}}] || []};
    component.renderApprovalForm(approvalForm);
    expect(dialogSpy).toHaveBeenCalled(); 
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });
  
  // // this is no longer called since files are made available for review using presigned URL
  // it('should call copyFileToTeamBucket and call api gateway service export file for review', () => {
  //     sessionStorage.setItem('team_bucket_name', 'dot-sdc-software');
  //     component.userName = 'sdemo';
  //     let exportFileForReview = {'TeamBucket' : 'dev-dot-sdc-raw-submissions-911061262852-us-east-1', 'S3Key' : 's3key', 'TeamName' : 'SDC Team'};
  //     component.copyFileToTeamBucket(exportFileForReview); 
  //     expect(mockObjectMap['mockApiGatewayService'].post).toHaveBeenCalled();
  //     expect(mockObjectMap['mockMatSnackBar'].open).toHaveBeenCalled();  
  // }); 

  //it('should call requestDownload and call api gateway service getDownloadUrl', () => {
  it('should call requestDownloadForReview and call api gateway service getDownloadUrl', () => {  
    let exportFileForReview = {'TeamBucket' : 'dev-dot-sdc-raw-submissions-911061262852-us-east-1', 'S3Key' : 's3key', 'TeamName' : 'SDC Team'};
    //component.requestDownload(exportFileForReview); 
    component.requestDownloadForReview(exportFileForReview); 
    expect(mockObjectMap['mockApiGatewayService'].getDownloadUrl).toHaveBeenCalled();
  });  
  

  it('should call api gateway service updatefilestatus (s3 export)', () => {
    let status = "status";
    let targetObj = {'TeamBucket' : 'dev-dot-sdc-raw-submissions-911061262852-us-east-1', 'dataset' : 'WAZE', 'RequestedBy_Epoch' : 'Cheryl Rousseau', 'UserEmail' : 'crousseau@acrotron.com', 'S3Key' : 's3key', 'S3KeyHash' : 's3keyhash','TeamName' : 'SDC Team'};
    component.submitApproval(status, targetObj); 
    expect(mockObjectMap['mockApiGatewayService'].post).toHaveBeenCalled();
  });

  it('should call api gateway service updatefilestatus (table export)', () => {
    let status = "status";
    let targetObj = {'table' : 'acme_test01', 'dataset' : 'acme', 'RequestedBy_Epoch' : 'Chris Fitzgerald', 'UserEmail' : 'cfitzgerald@acrotron.com', 'S3Key' : 's3key', 'S3KeyHash' : 's3keyhash','TeamName' : 'SDC Team'};
    component.submitApproval(status, targetObj); 
    expect(mockObjectMap['mockApiGatewayService'].post).toHaveBeenCalled();
  });

  it('should call api gateway service updatetrustedstatus', () => {
    let status = "status";
    let key1 = "key1";
    let key2 = "key2";
    let trustedRequest = {'TeamBucket' : 'dev-dot-sdc-raw-submissions-911061262852-us-east-1', 'dataset' : 'WAZE', 'RequestedBy_Epoch' : 'Cheryl Rousseau', 'UserEmail' : 'crousseau@acrotron.com', 'S3Key' : 's3key', 'S3KeyHash' : 's3keyhash','TeamName' : 'SDC Team'};
    component.submitTrustedApproval(status, key1, key2, trustedRequest); 
    expect(mockObjectMap['mockApiGatewayService'].post).toHaveBeenCalled();
  });

  it('should call parse url passing URL string', () => {
    let queryString = 'http://manage_user_workstation?user=cheryl&password=password'
    component.parseQueryString(queryString); 
  });
});