import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import {LocationService} from './location.service';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import {WeatherService} from './weather.service';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from '@angular/router';
import {routing} from './app.routing';
import {HttpClientModule} from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoadButtonComponent } from './load-button/load-button.component';
import { EmbedViewDirective } from './embed-view-directive/embed-view.directive';
import { AutocompleteSelectComponent } from './autocomplete-select/autocomplete-select.component';
import { HighlightPipe } from './autocomplete-select/hightlight.pipe';
import { InputFocusDirective } from './autocomplete-select/input-focus.directive';


@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    LoadButtonComponent,
    EmbedViewDirective,
    AutocompleteSelectComponent,
    HighlightPipe,
    InputFocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [LocationService, WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
