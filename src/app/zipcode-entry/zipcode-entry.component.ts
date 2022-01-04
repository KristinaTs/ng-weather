import { Component } from '@angular/core';
import {LocationService} from '../location.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service: LocationService) { }

  addLocation(zipcode: string): Observable<any> {
    return this.service.addLocation(zipcode);
  }

}
