import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxWebstorageModule } from 'ngx-webstorage';

// PAGES
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DrugstoreComponent } from './pages/drugstore/drugstore.component';
import { ClientComponent } from './pages/client/client.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// REDUX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { appReducers } from './store/reducers/app.reducers';
import { DrugstoreEffects } from './store/effects/drugstore.effects';
import { CustomerEffects } from './store/effects/customer.effects';
import { ProductEffects } from './store/effects/product.effects';

// COMPONENTS
import { StepperComponent } from './components/stepper/stepper.component';
// Angular Material components
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatCheckbox, MatCheckboxModule, MatRadioModule, MatProgressSpinnerModule } from '@angular/material';

// ENV
import { environment } from '../environments/environment';

// MFF (Mock For Frontend)
import { MFFService } from './services/mff/mff.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { HeaderComponent } from './components/header/header.component';
import { PageCardComponent } from './components/page-card/page-card.component';
import { ProductSearchComponent } from './pages/product-search/product-search.component';
import { SearchComponent } from './components/search/search.component';
import { OnBoardingComponent } from './components/on-boarding/on-boarding.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { ErrorCardComponent } from './components/error-card/error-card.component';
import { FilterComponent } from './components/filter/filter.component';
import { MiniCartComponent } from './components/mini-cart/mini-cart.component';
import { SubtotalComponent } from './components/subtotal/subtotal.component';
import { CheckoutSuccessComponent } from './pages/checkout-success/checkout-success.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CheckoutTableComponent } from './components/checkout-table/checkout-table.component';
import { CheckoutSummaryComponent } from './components/checkout-summary/checkout-summary.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DetailsBoxComponent } from './components/details-box/details-box.component';
import { QuantityComponent } from './components/quantity/quantity.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DrugstoreComponent,
    ClientComponent,
    ProductSearchComponent,
    NotFoundComponent,
    StepperComponent,
    DrugstoreComponent,
    AutocompleteComponent,
    HeaderComponent,
    PageCardComponent,
    SearchComponent,
    OnBoardingComponent,
    SearchResultComponent,
    ErrorCardComponent,
    FilterComponent,
    MiniCartComponent,
    SubtotalComponent,
    CheckoutSuccessComponent,
    CheckoutComponent,
    CheckoutTableComponent,
    CheckoutSummaryComponent,
    LoaderComponent,
    DetailsBoxComponent,
    QuantityComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([CustomerEffects, DrugstoreEffects, ProductEffects]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
    FormsModule,
    TextMaskModule,
    InMemoryWebApiModule.forRoot(MFFService, { passThruUnknownUrl: true }),
    // Angular Material
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
