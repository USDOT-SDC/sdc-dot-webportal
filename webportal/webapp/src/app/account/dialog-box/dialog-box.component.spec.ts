import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxComponent } from './dialog-box.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule,
   MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, MatTabsModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiGatewayService } from '../../../services/apigateway.service';
import { HttpClient } from '@angular/common/http';
import { CognitoService } from '../../../services/cognito.service';

let exportWorkflow;

describe('DialogBoxComponent', () => {
  let component: DialogBoxComponent;
  let fixture: ComponentFixture<DialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule,
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
      declarations: [ DialogBoxComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiGatewayService, useClass: class {} },
        { provide: CognitoService, useClass: class {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} // Add any data you wish to test if it is passed/used correctly
        },
        { provide: HttpClient, useClass: class {} }
      ]
    })
    .compileComponents();
  }));

  

  beforeEach(() => {
    let exportWorkflow;
    exportWorkflow = "MASS DOT";
    fixture = TestBed.createComponent(DialogBoxComponent);
    component = fixture.componentInstance;
    component.exportWorkflow = exportWorkflow;
    fixture.detectChanges();
  });

  it('should create', () => {
    
    expect(component).toBeTruthy();
  });
});
