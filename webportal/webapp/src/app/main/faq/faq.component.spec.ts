import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";

import { HomeFaqComponent } from "./faq.component";
import { Routes, Router, UrlTree } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { APP_BASE_HREF } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeFaqComponent },
  { path: "**", redirectTo: "home" },
];

describe("HomeFaqComponent", () => {
  let component: HomeFaqComponent;
  let fixture: ComponentFixture<HomeFaqComponent>;
  let tree;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [HomeFaqComponent],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create the app", waitForAsync(() => {
    const fixture = TestBed.createComponent(HomeFaqComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it("should test navigationEnd", () => {
    TestBed.inject(Router)
      .navigate(["/home"])
      .then(() => {
        console.log("##### Test Location ", location);
        expect(location.pathname.endsWith("/context.html")).toBe(true);
      })
      .catch((e) => console.log(e));
  });

  it("should test tree.fragment", () => {
    TestBed.inject(Router)
      .navigate(["/home"])
      .then(() => {
        console.log("##### Test Location ", location);
        expect(location.pathname.endsWith("/context.html")).toBe(true);
      })
      .catch((e) => console.log(e));

    let route = {
      parseUrl: jasmine.createSpyObj("route", ["parseUrl"]),
    };
  });
});
