import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MatButtonModule,   MatMenuModule,    MatCardModule,    MatToolbarModule,    MatIconModule,    MatTableModule,    MatExpansionModule,    MatSnackBarModule,    MatInputModule,    MatFormFieldModule,    MatDialogModule,    MatSelectModule,    MatOptionModule,    MatRadioModule,    MatCheckboxModule,    MatTabsModule } from '@angular/material';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';   
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';     //MatOption is  imported from MatSelectModule not MatOptionModule
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';




import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
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
        //MatOptionModule,
        MatRadioModule,
        MatCheckboxModule,
        MatTabsModule,],
      declarations: [
        AppComponent
      ],
      providers: [{ provide: APP_BASE_HREF, useValue : '/' }
      ],
    }).compileComponents();
  }));
  
  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

});
