import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// PAGES
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DrugstoreComponent } from './pages/drugstore/drugstore.component';
import { ClientComponent } from './pages/client/client.component';

// REDUX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { appReducers } from './store/reducers/app.reducers';
import { UserEffects } from './store/effects/user.effects'

// COMPONENTS
import { StepperComponent } from './components/stepper/stepper.component';
import { ButtonComponent } from './components/button/button.component';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// ENV
import { environment } from '../environments/environment';
import { DwAutocompleteComponent } from './components/dw-autocomplete/dw-autocomplete.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DrugstoreComponent,
    ClientComponent,
    NotFoundComponent,
    ButtonComponent,
    StepperComponent,
    DwAutocompleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([UserEffects]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
