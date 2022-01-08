import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

/**
 * Not used
 */
@Directive({selector: '[appEmbedView]'})
export class EmbedViewDirective {
  @Input() set viewToRender(value: TemplateRef<any>) {
    this.setState(value);
  }

  constructor(
    private viewContainerRef: ViewContainerRef
    ) {
  }

  setState(state) {
    this.viewContainerRef.clear();
    if (state instanceof TemplateRef) {
      this.viewContainerRef.createEmbeddedView(<TemplateRef<any>>state);
    }
  }
}
