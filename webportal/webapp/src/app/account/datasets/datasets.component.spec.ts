import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetsComponent } from './datasets.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatSnackBar, MatDialog} from '@angular/material';
import { Routes } from '@angular/router';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

let RESULT = {'message': 'dialog box closed'};

class mockMatDialog {
  open() {
    return {
      afterClosed: () => of(RESULT)
    };
  }
};

let dialog: mockMatDialog;

// let mockMatDialog = {
//   open: jasmine.createSpy('open').and.returnValue(of(RESULT))      
// };

describe('DatasetsComponent', () => {
  let component: DatasetsComponent;
  let fixture: ComponentFixture<DatasetsComponent>;
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

  let METADATA = {
    'download': 'true',
    'export': 'false',
    'publish': 'true',
    'requestReviewStatus': 'true',
    'datasets': [{exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'SDC platform'},
                 {exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'Other platform'},
                 {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'SDC platform'},
                 {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'Other SDC platform'}],
    'roles': 'user',
    'userTrustedStatus': { status: 'success' },
    'filename': 'dummyFilename'
  }
 
  const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: DatasetsComponent },
    { path: '**', redirectTo: 'home' }
  ];

  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...

  beforeEach(async(() => {
    let mockMatSnackBar = {
      open: jasmine.createSpy('open')
    };
          
    let mockApiGatewayService = jasmine.createSpyObj(ApiGatewayService.name,
      {
        'getUserInfo': of(RESPONSE),
        'get': of(RESPONSE),
        'getMetadataOfS3Object': of(RESPONSE),
        'getDownloadUrl': of(RESPONSE)
      });

    
    mockObjectMap = Object.assign({}, {
      mockMatSnackBar,
      mockMatDialog,
      mockApiGatewayService
    });
   
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatDialogModule
      ],
      declarations: [ DatasetsComponent ],
      providers: [
          {provide: APP_BASE_HREF, useValue: '/'},
          {provide: ApiGatewayService, useValue: mockApiGatewayService}, 
          {provide: MatSnackBar, useValue: mockMatSnackBar},
         // {provide: MatDialog, useValue: mockMatDialog},
         // {provide: MatDialogRef, useValue: {} },
         // {provide: MAT_DIALOG_DATA, useValue: {} }
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
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
    
    fixture = TestBed.createComponent(DatasetsComponent);
    component = fixture.componentInstance;    
    //dialog = TestBed.get(MatDialog);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserInfo', () => {
    component.ngOnInit();
    expect(mockObjectMap['mockApiGatewayService'].getUserInfo).toHaveBeenCalled();    
   });

   it('should return response when call getMetadataOfS3Object is called', () => {
      const result = component.getMetadataForS3Objects("filename");
      expect(mockObjectMap['mockApiGatewayService'].getMetadataOfS3Object).toHaveBeenCalled();
      expect(result).toBeTruthy;
   }); 

   it('should call ApiGatewayService get request review status', () => {
    component.getRequestReviewStatus('filename');
    expect(mockObjectMap['mockApiGatewayService'].get).toHaveBeenCalled();    
   });

   it('should call ApiGatewayService get download url', () => {
    component.selectedFiles = [{'filename': 'tempFile1', 'download': 'true'}, {'filename': 'file2', 'download': 'false'}];
    component.myDatasets = [
      {exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'SDC platform', filename: 'tempFile1', download: 'true'},
      {exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'Other platform', filename: 'tempFile2', download: 'true'},
      {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'SDC platform'},
      {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'Other SDC platform'}];
    component.requestDownload();
    expect(mockObjectMap['mockApiGatewayService'].getDownloadUrl).toHaveBeenCalled();    
   });

   //selectsdcDataset
   it('should call ApiGatewayService get with successful response data', () => {
     let mockDataset =   [{exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'SDC platform'},
     {exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'Other platform'},
     {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'SDC platform'},
     {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'Other SDC platform'}]
    component.selectsdcDataset(mockDataset);
    expect(mockObjectMap['mockApiGatewayService'].get).toHaveBeenCalled();    
   });

   //selectsdcDataset
  //  it('should call ApiGatewayService get with error', () => {
  //    //let ERROR = {message: "some-error"}
  //    let mockApiGatewayService: ApiGatewayService;
  //    let mockDataset =   [{exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'SDC platform'},
  //     {exportWorkflow: 'testuser@gmail.com', Type: 'Algorithm', Owner: 'Other platform'},
  //     {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'SDC platform'},
  //     {exportWorkflow: 'testuser@gmail.com', Type: 'Other Algorithm', Owner: 'Other SDC platform'}]
  //     spyOn(mockApiGatewayService,"get").and.returnValue(Observable.throw({message: "some-error"}));
  //     component.selectsdcDataset(mockDataset);
  //     expect(mockObjectMap['mockApiGatewayService'].get).toHaveBeenCalled();    
  // });
  it('should open and close requestMail dialog box', () => { 
    component.requestMail('dot-sdc-softwares', 'mailType', 'Waze');
    expect(dialogSpy).toHaveBeenCalled();

    // You can also do things with this like:
    //expect(dialogSpy).toHaveBeenCalledWith(TestComponent, { maxWidth: '100vw' });
    // and ...
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('should close requestMail dialog box', () => { 
    component.requestMail('dot-sdc-softwares', 'mailType', 'Waze');    
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('should open and close requestExport dialog box', () => {
    component.requestExport('dot-sdc-softwares', 'mailType', 'Waze');
    expect(dialogSpy).toHaveBeenCalled(); 
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('should open and close uploadFilesToS3 dialog box', () => {
    component.uploadFilesToS3('uploadFiles'); 
    expect(dialogSpy).toHaveBeenCalled(); 
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled(); 
  });

  it('should call parse url passing URL string', () => {
    let queryString = 'http://manage_user_workstation?user=cheryl&password=password'
    component.parseQueryString(queryString); 
  });
});

// it('handleErrors should open the snacker', () => {
//   spyOn(component.snackBar, 'open');
//   component.handleErrors({message: 'error'} as any);
//   expect(component.snackBar.open).toHaveBeenCalledWith('error', '', {duration: 1500});
// });