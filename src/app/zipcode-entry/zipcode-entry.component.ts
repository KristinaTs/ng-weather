import { Component, OnDestroy } from '@angular/core';
import { LocationService } from '../location.service';
import { Observable, Subject } from 'rxjs';
import { WeatherService } from '../weather.service';
import { countries } from '../counties';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent implements OnDestroy {
  actionObservable: Observable<any>;
  countries = countries;

  form = new FormGroup({
    zipcode: new FormControl(''),
    countryCode: new FormControl('')
  });
  private subControl = new Subject();

  constructor(
    private service: LocationService,
    private weatherService: WeatherService) {
    this.listenForFormChanges();
  }

  addLocation(event: { hasError: boolean }): void {
    if (!event.hasError) {
      const {zipcode, countryCode} = this.form.value;
      this.service.addLocation(zipcode, countryCode);
      this.form.reset();
    } else {
      // Display error message
    }
  }

  addConditions(zipcode: string, code: string): Observable<any> {
    /* Return observable to try and get the new locations conditions
     if the status is OK we call the method addLocations
     which will add our location to the array of locations with a polling mechanism */
    return this.weatherService.getConditions(zipcode, code);
  }

  private listenForFormChanges(): void {
    this.form.valueChanges.pipe(
      takeUntil(this.subControl)
    ).subscribe(value => {
      const {zipcode, countryCode} = value;
      if (zipcode && countryCode) {
        this.actionObservable = this.addConditions(zipcode, countryCode);
      }
    });
  }

  ngOnDestroy() {
    this.subControl.next();
  }
}
