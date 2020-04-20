import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetinfoComponent } from './datasetinfo.component';
import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule } from '@angular/material';

describe('DatasetinfoComponent', () => {
  let component: DatasetinfoComponent;
  let fixture: ComponentFixture<DatasetinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
        MatCheckboxModule],
      declarations: [ DatasetinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(DatasetinfoComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
});
