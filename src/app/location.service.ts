import { Injectable } from '@angular/core';
import { WeatherService } from './weather.service';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locations: { zipcode: string, countryCode: string }[] = [];

  constructor(private weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }

    for (const loc of this.locations) {
      this.weatherService.addCurrentConditions(loc.zipcode, loc.countryCode);
    }
  }

  addLocation(zipcode: string, countryCode: string = 'us'): void {
    if (!zipcode) {
      return;
    }
    this.locations.push({zipcode, countryCode});
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode, countryCode);
  }

  removeLocation(zipcode: string): void {
    const index = this.locations.map(location => location.zipcode).indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
