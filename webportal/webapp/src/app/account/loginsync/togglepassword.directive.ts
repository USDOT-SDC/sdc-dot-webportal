import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTogglePassword]'
})
export class TogglePasswordDirective {
  private passwordShown = false;

  constructor(private el: ElementRef) {
    this.setup();
  }

  setup() {
    const parent = this.el.nativeElement.parentNode;

    const pTag = document.createElement('p');
    pTag.setAttribute('class', 'usa-form__note');
    const aTag = document.createElement('a');
    aTag.setAttribute('class', 'usa-show-password');
    aTag.innerHTML = 'Show Password';
    pTag.appendChild(aTag);
    aTag.addEventListener('click', () => {
      this.toggle(aTag);
    });

    parent.appendChild(pTag);
  }

  toggle(aTag: HTMLElement) {
    this.passwordShown = !this.passwordShown;
    this.el.nativeElement.setAttribute('type', this.passwordShown ? 'text' : 'password');
    aTag.innerHTML = this.passwordShown ? 'Hide Password' : 'Show Password';
  }

}
