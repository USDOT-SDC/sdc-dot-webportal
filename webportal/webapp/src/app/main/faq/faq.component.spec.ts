import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HomeFaqComponent } from './faq.component';
import { Routes, Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeFaqComponent },
  { path: '**', redirectTo: 'home' }
];

describe('HomeFaqComponent', () => {
  let component: HomeFaqComponent;
  let fixture: ComponentFixture<HomeFaqComponent>;  
  let tree;

  beforeEach(async(() => {    

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
      ], 
      declarations: [
         HomeFaqComponent,
       ], 
      providers: [  
        { provide: APP_BASE_HREF, useValue : '/' } 
      ],
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

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(HomeFaqComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should test navigationEnd', () => {
    //TestBed.get(Router)
    TestBed.inject(Router)    
      .navigate(['/home'])
        .then(() => {         
          console.log("##### Test Location ", location);
          expect(location.pathname.endsWith('/context.html')).toBe(true);
        }).catch(e => console.log(e));
  });  

  it('should test tree.fragment', () => {
    //let tree = new UrlTree();
    //spyOn(tree, 'fragment').and.returnValue('fragment');
    //let route = jasmine.createSpyObj('Route', ['parseUrl']).and.returnValue('home/test?debug#fragment');
    // let route; jasmine.createSpyObj('Route', ['parseUrl']);
    // route.UrlTree = {
    //     val: 'home/test?debug#fragment'
    // }
    //let tree = jasmine.createSpyObj('tree', ['fragment']);
    //TestBed.get(Router)
    TestBed.inject(Router)
      .navigate(['/home'])
        .then(() => {         
          console.log("##### Test Location ", location);
          expect(location.pathname.endsWith('/context.html')).toBe(true);
        }).catch(e => console.log(e));

      let route = {
        parseUrl: jasmine.createSpyObj('route', ['parseUrl'])
      }
    // const tree: UrlTree = 
    // TestBed.get(Router)
    //   .parseUrl(["/home/test?debug#fragment"])
    //     .then(() => {                  
    //       console.log("##### Test Location ", location);
    //       expect(location.pathname.endsWith('/context.html')).toBe(true);          
    //     }).catch(e => console.log(e));
    //let tree = {
    //  fragment: jasmine.createSpyObj('tree', ['fragment'])
    //}
    //expect(tree.fragment).toEqual('fragment');
  });
 
});
