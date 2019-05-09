import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { SessionStorageService, LocalStorageService, LocalStorage, SessionStorage } from 'ngx-webstorage';
import { IAppState } from '../../store/state/app.state';
import { IDrugstore } from '../../models/drugstore.interface';
import { ResetCustomer, ResetProfileInfo, ValidateProfile } from '../../store/actions/customer.actions';
import { ICustomer } from '../../models/customer.interface';
import { Router } from '@angular/router';
import { routesWithHeader } from 'src/assets/authorized-router';
import { selectProfileResponse } from 'src/app/store/selectors/customer.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public showHeader = true;
  @Input() displayAlert: boolean;
  // Subscribe to local storage item
  @LocalStorage('selected_drugstore')
  public selectedDrugstore: IDrugstore;
  // Subscribe to session storage item
  @SessionStorage('selected_customer')
  public selectedCustomer: ICustomer;

  @Output() displayAlertClick: EventEmitter<any> = new EventEmitter();

  public userMessages: string[] = ['valor um', 'valor dois'];
  public currentRoute: string;
  public loadingProfile: boolean = false;

  public profileResponse$ = this._store.select(selectProfileResponse);

  showMessageSlider() {
    this.displayAlertClick.emit();
  }

  constructor(
    private _sessionStorage: SessionStorageService,
    private _localStorage: LocalStorageService,
    private _store: Store<IAppState>,
    private _router: Router,
  ) { }

  ngOnInit() {
    this._router.events
      .subscribe((event: any) => {
        if (event.url) {
          this.showHideHeader(event.url);
        }
      });
    this.selectedDrugstore = this._localStorage.retrieve('selected_drugstore');
    this.selectedCustomer = this._sessionStorage.retrieve('selected_customer');

    // if (this.selectedCustomer && this.selectedCustomer.cpf !== '0') {
    //   this._store.dispatch(new ValidateProfile(this.selectedCustomer.cpf))
    // }
  }

  ngOnDestroy() {
    this._store.dispatch(new ResetProfileInfo())
  }

  showHideHeader(url: string): void {
    this.showHeader = routesWithHeader.includes(url);
  }

  handleResetCustomer() {
    this._sessionStorage.clear('selected_customer');
    this._store.dispatch(new ResetCustomer());
  }
}
