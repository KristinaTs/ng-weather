import { Component } from '@angular/core';
import {LocationService} from '../location.service';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service: LocationService, private weatherService: WeatherService) { }

  addLocation(zipcode: string): void {
    this.service.addLocation(zipcode);
  }

  addConditions(zipcode: string): Observable<any> {
    /* Return observable to try and get the new locations conditions
     if the status is OK we call the method addLocations
     which will add our location to the array of locations with a polling mechanism */
    return this.weatherService.getConditions(zipcode);
  }
}
