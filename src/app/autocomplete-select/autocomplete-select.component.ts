import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class AutocompleteSelectComponent<T> implements ControlValueAccessor {
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

  /**
   * Get the label of the currently selected item
   */
  get label() {
    return this.selectedValue ? this.selectedValue[this.displayKey] : 'Select...';
  }

  /**
   * Open the dropdown and mark the element as touched
   * Used for the form
   */
  open(): void {
    this.markAsTouched();
    if (!this.disabled) {
      this.isOpen = true;
    }
  }

  /**
   * Filter the options depending on the input of the user
   * @param value
   */
  handleSearchChange(value: string): void {
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

  /**
   * When the value changes by user inout notify the parent form for the change
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Called when the user first interacted with the form control
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Method called by the Form module to set the value of the form control
   * @param obj
   */
  writeValue(obj: T): void {
    if (obj) {
      this.selectedValue = this.options.find((item) => item[this.valueKey] === obj[this.valueKey]);
    } else {
      this.selectedValue = null;
    }
  }

  /**
   * Mark the control as touched
   */
  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
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

