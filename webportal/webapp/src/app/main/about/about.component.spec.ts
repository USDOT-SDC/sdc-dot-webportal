import {waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';
//import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
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

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(waitForAsync(() => {
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
        //MatOptionModule,
        MatRadioModule,
        MatCheckboxModule],
      declarations: [ AboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be initialized', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeDefined();
  });

  it('should create', () => {
    let comp = new AboutComponent();
    console.log(comp);
    expect(comp).toBeTruthy();
    comp.ngOnInit();
    expect(true).toBe(true);
  });

  /*
  it('should call ngOnInit', () => {
    //component.ngOnInit();
    let comp = jasmine.createSpyObj('component', ['ngOnInit']);
    comp.ngOnInit();
    expect(comp.ngOnInit()).toHaveBeenCalled();
  });
  */
});
