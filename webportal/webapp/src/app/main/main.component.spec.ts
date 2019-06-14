import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

fdescribe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  class MockRouter {
    public ne = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
    public events = new Observable(observer => {
      observer.next(this.ne);
      observer.complete();
    });
  }
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [ MainComponent ],
      providers: [CognitoService, { provide: APP_BASE_HREF, useValue : '/' },
       {provide: Router, useClass: MockRouter}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
