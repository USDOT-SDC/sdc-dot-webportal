import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFaqComponent } from './faq.component';
import { BrowserModule } from '@angular/platform-browser';
import { RoutingModule } from '../../app.routes';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { TableModule } from 'primeng/table';
import { FileUploadModule, SharedModule, PanelModule, RadioButtonModule, MessageModule } from 'primeng/primeng';
import { MarkdownModule } from 'ngx-md';
import { ToastyModule } from 'ng2-toasty';
import { MainComponent } from '../main.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { AccountComponent } from '../../account/account.component';
import { AccountHomeComponent } from '../../account/accounthome/accounthome.component';
import { DatasetsComponent } from '../../account/datasets/datasets.component';
import { ExportRequestsComponent } from '../../account/exportrequests/exportrequests.component';
import { WorkstationComponent } from '../../account/workstation/workstation.component';
import { RegisterComponent } from '../register/register.component';
import { DialogBoxComponent } from '../../account/dialog-box/dialog-box.component';
import { FaqComponent } from '../../account/faq/faq.component';
import { DatasetinfoComponent } from '../datasetinfo/datasetinfo.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { APP_BASE_HREF } from '@angular/common';

class MockRouter {
  public ne = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
  public events = new Observable(observer => {
    observer.next(this.ne);
    observer.complete();
  });
}

describe('HomeFaqComponent', () => {
  let component: HomeFaqComponent;
  let fixture: ComponentFixture<HomeFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RoutingModule,
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
        MatTabsModule],
      declarations: [ 
        MainComponent,
        HomeComponent,
        AboutComponent,
        AccountComponent,
        AccountHomeComponent,
        DatasetsComponent,
        ExportRequestsComponent,
        WorkstationComponent,
        RegisterComponent,
        DialogBoxComponent,
        FaqComponent,
        HomeFaqComponent,
        DatasetinfoComponent
      ],
      providers: [{provide: Router, useClass: MockRouter}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
