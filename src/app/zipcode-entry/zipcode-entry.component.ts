import { Component } from '@angular/core';
import { LocationService } from '../location.service';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather.service';
import { countries } from '../counties';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  countries = countries;

  form = new FormGroup({
    zipcode: new FormControl(''),
    countryCode: new FormControl('')
  });

  constructor(
    private service: LocationService,
    private weatherService: WeatherService) {
  }

  addLocation(event: { hasError: boolean }): void {
    if (!event.hasError) {
      const {zipcode, countryCode} = this.form.value;
      this.service.addLocation(zipcode, countryCode);
      this.form.reset();
    } else {
      // Display error message if we want
    }
  }

  addConditions(): Observable<any> {
    /* Return observable to try and get the new locations conditions
     if the status is OK we call the method addLocations
     which will add our location to the array of locations with a polling mechanism */
    const {zipcode, countryCode} = this.form.value;
    return this.weatherService.getConditions(zipcode, countryCode);
  }
}
