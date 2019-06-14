import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHomeComponent } from './accounthome.component';
import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { RoutingModule } from '../../app.routes';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountComponent } from '../account.component';
import { MainComponent } from '../../main/main.component';
import { HomeComponent } from '../../main/home/home.component';
import { AboutComponent } from '../../main/about/about.component';
import { DatasetinfoComponent } from '../../main/datasetinfo/datasetinfo.component';
import { RegisterComponent } from '../../main/register/register.component';
import { HomeFaqComponent } from '../../main/faq/faq.component';
import { DatasetsComponent } from '../datasets/datasets.component';
import { ExportRequestsComponent } from '../exportrequests/exportrequests.component';
import { WorkstationComponent } from '../workstation/workstation.component';
import { FaqComponent } from '../faq/faq.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

describe('MyAccountComponent', () => {
  let component: AccountHomeComponent;
  let fixture: ComponentFixture<AccountHomeComponent>;

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      imports: [
        RouterModule,        
        RoutingModule,
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
        MatTabsModule ],
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
        FaqComponent ],
        schemas: [ NO_ERRORS_SCHEMA ],
        providers: [{provide: APP_BASE_HREF, useValue : '/' }]  
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
