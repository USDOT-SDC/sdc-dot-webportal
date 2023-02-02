import {waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqComponent } from './faq.component';
//import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'; 
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';     //MatOption is  imported from MatSelectModule not MatOptionModule
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule, Routes, Router } from '@angular/router';
import { RoutingModule } from '../../app.routes';
import { AccountComponent } from '../account.component';
import { MainComponent } from '../../main/main.component';
import { HomeComponent } from '../../main/home/home.component';
import { AboutComponent } from '../../main/about/about.component';
import { DatasetinfoComponent } from '../../main/datasetinfo/datasetinfo.component';
import { RegisterComponent } from '../../main/register/register.component';
import { HomeFaqComponent } from '../../main/faq/faq.component';
import { AccountHomeComponent } from '../accounthome/accounthome.component';
import { DatasetsComponent } from '../datasets/datasets.component';
import { ExportRequestsComponent } from '../exportrequests/exportrequests.component';
import { WorkstationComponent } from '../workstation/workstation.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: FaqComponent },
  { path: '**', redirectTo: 'home' }
];

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
      ], 
      declarations: [ FaqComponent ],
        schemas: [ NO_ERRORS_SCHEMA ],
        providers: [ {provide: APP_BASE_HREF, useValue : '/' } ] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(FaqComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should test navigationEnd', () => {
  //TestBed.get(Router)
    TestBed.inject(Router)  

      .navigate(['/home'])
        .then(() => {         
          console.log(location);
          expect(location.pathname.endsWith('/context.html')).toBe(true);
        }).catch(e => console.log(e));
  });
});
