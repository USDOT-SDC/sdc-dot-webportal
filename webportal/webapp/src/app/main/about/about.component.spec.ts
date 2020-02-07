import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';
import { MatButtonModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatTableModule, MatExpansionModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule } from '@angular/material';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

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
