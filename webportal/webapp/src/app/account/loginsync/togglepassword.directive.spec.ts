import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TogglePasswordDirective } from './togglepassword.directive';

@Component({
  template: '<input type="password" appTogglePassword>'
})
class TestComponent {
  constructor() {}
}

describe('TogglePasswordDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TogglePasswordDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should toggle to show password when clicked once', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const input: HTMLElement = debugEl.querySelector('input');
    const aTag: HTMLElement = debugEl.querySelector('a');

    aTag.click();
    fixture.detectChanges();

    expect(input.getAttribute('type')).toEqual('text');
  });
});
