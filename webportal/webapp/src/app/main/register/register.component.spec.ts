import {ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { MatCardModule } from '@angular/material/card';
import { CognitoService } from '../../../services/cognito.service';

let mockObjectMap = {};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async() => {
    let mockCognitoAPIService = {
      login: jasmine.createSpy('login')
    }

    mockObjectMap = Object.assign({}, {
    mockCognitoAPIService  
    });

    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [ RegisterComponent ],
      providers: [
        { provide: CognitoService, useValue: mockCognitoAPIService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should call login', () => {
  //   component.userLogin();
  //   expect(mockObjectMap['mockCognitoAPIService'].login).toHaveBeenCalled();
  // });

});
