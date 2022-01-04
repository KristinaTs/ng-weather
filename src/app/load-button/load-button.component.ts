import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-load-button',
  templateUrl: './load-button.component.html'
})
export class LoadButtonComponent {
  @Input() btnNormalState: string | HTMLElement = 'Save';
  @Input() loadState: string | HTMLElement = 'Loading...';
  @Input() doneState: string | HTMLElement = 'Done!';
  @Input() actionObservable: Observable<any>;

  @Output() completed = new EventEmitter<any>();
  btnCurrentState: string | HTMLElement = this.btnNormalState;

  handleBtnClick(): void {
    if (this.actionObservable) {
      this.btnCurrentState = this.loadState;
      this.actionObservable.subscribe(data => {
        this.btnCurrentState = this.doneState;
        this.completed.emit();
      });
    }
  }
}
