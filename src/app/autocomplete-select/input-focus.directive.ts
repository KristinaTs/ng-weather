import {AfterContentChecked, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: 'input[inputAutoFocus]'
})
export class InputFocusDirective implements AfterContentChecked {
  constructor(private element: ElementRef<HTMLInputElement>) {}

  /**
   * Focus the input passed to this directive
   */
  ngAfterContentChecked(): void {
    this.element.nativeElement.focus();
  }
}
