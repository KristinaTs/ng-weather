import { Component } from '@angular/core';
import { LocationService } from '../location.service';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  actionObservable: Observable<any>;

  constructor(private service: LocationService, private weatherService: WeatherService) { }

  addLocation(event: {hasError: boolean}, zipcode: string): void {
    if (!event.hasError) {
      this.service.addLocation(zipcode);
    } else {
     // Display error message
    }
  }

  addConditions(zipcode: string): Observable<any> {
    /* Return observable to try and get the new locations conditions
     if the status is OK we call the method addLocations
     which will add our location to the array of locations with a polling mechanism */
      return this.weatherService.getConditions(zipcode);
  }

  /**
   * Added change method to call the addCondition method only on input change and not on every check
   * @param zipcode
   */
  handleZipcodeChange(zipcode: string) {
    this.actionObservable = this.addConditions(zipcode);
  }
}
