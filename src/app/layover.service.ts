import { Injectable, Injector } from '@angular/core';

export interface LayoverParams<T> {
  origin: HTMLElement;
  content: any;
  data?: T;
  width?: string | number;
  height: string | number;
}

@Injectable({  providedIn: 'root' })
export class Popover {
  // constructor(private overlay: Overlay, private injector: Injector) { }
  //
  // open<T>({ origin, content, data, width, height }: PopoverParams<T>) {
  //   const overlayRef = this.overlay.create(this.getOverlayConfig(origin));
  // }
  //
  // private getOverlayConfig({ origin, width, height }): OverlayConfig {
  //   return new OverlayConfig({
  //     width,
  //     height,
  //     hasBackdrop: true,
  //     backdropClass: 'popover-backdrop',
  //     positionStrategy: this.getOverlayPosition(origin),
  //     scrollStrategy: this.overlay.scrollStrategies.reposition()
  //   });
  // }

}
