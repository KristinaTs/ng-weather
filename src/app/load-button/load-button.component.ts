import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-load-button',
  templateUrl: './load-button.component.html',
  styleUrls: ['load-button.component.scss']
})
export class LoadButtonComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('loadTemplate') loadTemp: TemplateRef<any>;

  // Inputs to change button class depending on state
  @Input() normalStateClass = 'btn-primary';
  @Input() loadStateClass = 'btn-warning';
  @Input() doneStateClass = 'btn-success';
  @Input() errorClass = 'btn-danger';

  // Inputs to change button content
  @Input() normalState: string | TemplateRef<any> = 'Save';
  @Input() loadState: string | TemplateRef<any>;
  @Input() doneState: string | TemplateRef<any> = 'Done!';
  @Input() errorState: string | TemplateRef<any> = 'Error';
  @Input() actionObservable: () => Observable<any>;

  @Output() completed = new EventEmitter<{ hasError: boolean }>();
  currentBtnState: string | TemplateRef<any>;
  btnClass = '';
  isLoading = false;

  subControl = new Subject();

  /**
   * Set the initial button state
   */
  ngOnInit(): void {
    this.setState(this.normalState, this.normalStateClass);
    this.btnClass = this.normalStateClass;
  }

  /**
   * Sets the default loading state of the button to the template
   */
  ngAfterViewInit() {
    if (!this.loadState) {
      this.loadState = this.loadTemp;
    }
  }

  /**
   * Handle the button click
   * Execute the associated observable with the button
   * and change the states depending on the state of the observable
   *
   * After complete with SUCCESS or ERROR emit complete with hasError property
   */
  handleBtnClick(): void {
    if (this.actionObservable) {
      this.setState(this.loadState, this.loadStateClass);
      this.isLoading = true;
      this.actionObservable().pipe(
        takeUntil(this.subControl)
      ).subscribe(() => {
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

  /**
   * Set the state of the button
   * @param state
   * @param btnClass
   * @private
   */
  private setState(state: string | TemplateRef<any>, btnClass: string): void {
    this.currentBtnState = state;
    this.btnClass = btnClass;
  }

  /**
   * Update the state of the button to the initial state
   * @private
   */
  private updateToNormalState(): void {
    setTimeout(() => {
      this.setState(this.normalState, this.normalStateClass);
      // change to loading false only after we are back in normal state
      this.isLoading = false;
    }, 2000);
  }

  /**
   * Check if the state of the button is
   * a templateRef to know how to render it
   */
  isStateTemplate(): boolean {
    return this.currentBtnState instanceof TemplateRef;
  }

  /**
   * Make sure we unsubscribe from the provided observable
   * If the Observable is a custom one we must unsubscribe from it
   */
  ngOnDestroy(): void {
    this.subControl.next();
  }
}
