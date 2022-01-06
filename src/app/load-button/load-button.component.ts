import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-load-button',
  templateUrl: './load-button.component.html'
})
export class LoadButtonComponent implements OnInit {
  isLoading = false;
  // Inputs to change button class depending on state
  @Input() normalStateClass = 'btn-primary';
  @Input() loadStateClass = 'btn-warning';
  @Input() doneStateClass = 'btn-success';
  @Input() errorClass = 'btn-danger';

  // Inputs to change button content
  @Input() normalState: string | TemplateRef<any> = 'Save';
  @Input() loadState: string | TemplateRef<any> = 'Loading...';
  @Input() doneState: string | TemplateRef<any> = 'Done!';
  @Input() errorState: string | TemplateRef<any> = 'Error';
  @Input() actionObservable: Observable<any>;

  @Output() completed = new EventEmitter<{ hasError: boolean }>();
  currentBtnState: string | TemplateRef<any>;
  btnClass = '';

  ngOnInit(): void {
    this.setState(this.normalState, this.normalStateClass);
    this.btnClass = this.normalStateClass;
  }

  handleBtnClick(): void {
    if (this.actionObservable) {
     this.setState(this.loadState, this.loadStateClass);
     this.isLoading = true;
      this.actionObservable.subscribe(() => {
        this.setState(this.doneState, this.doneStateClass);
        // If the req was successful emit has error false and display the done state of the button
        this.completed.emit({hasError: false});
        this.updateToNormalState();
      }, () => {
        // In case of an error send error true and display the error button state
        this.setState(this.errorState, this.errorClass);
        this.completed.emit({hasError: true});
        this.updateToNormalState();
      });
    }
  }

  private setState(state: string | TemplateRef<any>, btnClass: string): void {
   this.currentBtnState = state;
   this.btnClass = btnClass;
  }

  private updateToNormalState(): void {
    setTimeout(() => {
      this.setState(this.normalState, this.normalStateClass);
      // change to loading false only after we are back in normal state
      this.isLoading = false;
    }, 3000);
  }

  isStateTemplate(): boolean {
    return this.currentBtnState instanceof TemplateRef;
  }

  isStateLoading(): boolean {
    return this.btnClass === this.loadStateClass;
  }
}
