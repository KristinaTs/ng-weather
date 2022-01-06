import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError, timer } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { map, retry, share, switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class WeatherService implements OnDestroy {
  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions: Map<string, Observable<any>> = new Map();
  private currentConditionsSubject = new BehaviorSubject(this.currentConditions);

  private subControl = new Subject();

  constructor(private http: HttpClient) {
  }

  addCurrentConditions(zipcode: string): void {
    // Here we make a request to get the current conditions data from the API.
    // Note the use of backticks and an expression to insert the zipcode
    this.currentConditions.set(
      zipcode,
      timer(0, 30000).pipe(
        takeUntil(this.subControl),
        switchMap(() => this.getConditions(zipcode)),
        // Retry if for some reason the request was not successful
        // I placed a limit of 2 tries as the API is limited in number of requests we can make
        retry(2),
        map(res => {
          if (!res.error) {
            return {zip: zipcode, data: res};
          }
        }),
        share()
      )
    );

    this.currentConditionsSubject.next(this.currentConditions);
  }

  getConditions(zipcode: string): Observable<any> {
    return this.http.get(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`);
  }

  removeCurrentConditions(zipcode: string): void {
    this.currentConditions.delete(zipcode);
    this.currentConditionsSubject.next(this.currentConditions);
  }

  getCurrentConditions(): Map<string, Observable<any>> {
    return this.currentConditions;
  }

  getForecast(zipcode: string): Observable<any> {
    // Here we make a request to get the forecast data from the API.
    // Note the use of backticks and an expression to insert the zipcode
    return this.http.get(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }

  getCurrentConditionsObs(): Observable<Map<string, Observable<any>>> {
    return this.currentConditionsSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.subControl.next();
    this.subControl.complete();
  }
}
