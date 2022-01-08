import { Component, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-autocomplete-select',
  templateUrl: './autocomplete-select.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AutocompleteSelectComponent
    }
  ]
})
export class AutocompleteSelectComponent<T> implements ControlValueAccessor, OnDestroy {
  private subControl = new Subject();
  touched = false;
  disabled = false;

  @Input() set listData(value: T[]) {
    if (value) {
      this.originalOptions = [...value];
      this.options = [...value];
    }
  }

  @Input() valueKey = 'name';
  @Input() displayKey = 'name';

  options: T[] = [];
  originalOptions: T[] = [];
  selectedValue: T = null;

  isOpen = false;

  private onChange = (selectedValue) => {};
  private onTouched = () => {};

  constructor(private eRef: ElementRef) {
  }

  get label() {
    return this.selectedValue ? this.selectedValue[this.displayKey] : 'Select...';
  }

  open(): void {
    this.markAsTouched();
    if (!this.disabled) {
      this.isOpen = true;
    }
  }

  handleSearchChange(value: string): void {
    // TODO add interval
    this.search(value);
  }

  /**
   * Handle selection on item from the dropdown
   * @param option
   */
  select(option): void {
    this.selectedValue = option;
    this.onChange(option[this.valueKey]);
    this.isOpen = false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: T): void {
    if (obj) {
      this.selectedValue = this.options.find((item) => item[this.valueKey] === obj[this.valueKey]);
    } else {
      this.selectedValue = null;
    }

  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  ngOnDestroy() {
    this.subControl.next();
  }

  /**
   * Listen for document click in order to know when we have clicked outside of the component
   * @param event
   */
  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.isOpen = this.eRef.nativeElement.contains(event.target);
  }

  private search(value: any): void {
    const term = value.toLowerCase();
    this.options = this.originalOptions.filter(
      option => option[this.displayKey].toLowerCase().includes(term)
    );
  }
}

