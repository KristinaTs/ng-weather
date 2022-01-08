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
  @Input() loadState: string | TemplateRef<any> = 'Loading...';
  @Input() doneState: string | TemplateRef<any> = 'Done!';
  @Input() errorState: string | TemplateRef<any> = 'Error';
  @Input() actionObservable: () => Observable<any>;

  @Output() completed = new EventEmitter<{ hasError: boolean }>();
  currentBtnState: string | TemplateRef<any>;
  btnClass = '';
  isLoading = false;

  subControl = new Subject();

  ngOnInit(): void {
    this.setState(this.normalState, this.normalStateClass);
    this.btnClass = this.normalStateClass;
  }

  ngAfterViewInit() {
    this.loadState = this.loadTemp;
  }

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

  private setState(state: string | TemplateRef<any>, btnClass: string): void {
   this.currentBtnState = state;
   this.btnClass = btnClass;
  }

  private updateToNormalState(): void {
    setTimeout(() => {
      this.setState(this.normalState, this.normalStateClass);
      // change to loading false only after we are back in normal state
      this.isLoading = false;
    }, 2000);
  }

  isStateTemplate(): boolean {
    return this.currentBtnState instanceof TemplateRef;
  }

  isStateLoading(): boolean {
    return this.btnClass === this.loadStateClass;
  }

  ngOnDestroy(): void {
    this.subControl.next();
  }
}
