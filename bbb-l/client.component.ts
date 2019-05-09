import { Component, OnInit } from '@angular/core';
import { SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged } from 'rxjs/operators';
import { cpfValidator } from '../../validators/cpf-validator';
import { GetCustomer, ResetCustomerErrors, ValidateProfile } from '../../store/actions/customer.actions';
import { selectCurrentCustomer, selectCustomerErrors } from '../../store/selectors/customer.selectors';
import { IAppState } from '../../store/state/app.state';
import { IStep } from '../../models/stepper.interface';
import { unmaskCpf } from '../../utils/unmaskcpf.util';
import { IDrugstore } from 'src/app/models/drugstore.interface';
import { UpdateCurrentDrugstore } from 'src/app/store/actions/drugstore.actions';
import { selectCurrentDrugstore } from 'src/app/store/selectors/drugstore.selectors';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  errors$ = this._store.select(selectCustomerErrors);
  selectedCustomer$ = this._store.pipe(select(selectCurrentCustomer))
    .subscribe((res) => {
      if (res !== null) {
        // Update selected customer with masked CPF and empty product list
        this._router.navigate(['/busca-produto']);

        if (res.cpf !== '0') {
          this._store.dispatch(new ValidateProfile(res.cpf))
        }

        this._sessionStorage.store('selected_customer',
          { ...res, cpf: res.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4'), products: [] }
        );

      }
    });

  selectedDrugstore$ = this._store.pipe(select(selectCurrentDrugstore))
    .subscribe((res: IDrugstore) => {
      if (Object.keys(res || {}).length > 0) {
        this._localStorage.store('selected_drugstore', res);
      }
    });

  // The regex will be used to test user input and either allow it or reject it.
  public maskCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  textField = new FormControl('', [Validators.required, cpfValidator]);

  steps: IStep[] = [
    { title: 'Cliente', completed: false, active: true },
    { title: 'Qual Produto?', completed: false, active: false },
    { title: 'Passo 3', completed: false, active: false },
    { title: 'Passo 4', completed: false, active: false },
  ];

  constructor (
    private _store: Store<IAppState>,
    private _sessionStorage: SessionStorageService,
    private _localStorage: LocalStorageService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.textField.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(newValue => {
        // Dispatch action to update field here...
        this._store.dispatch(new ResetCustomerErrors());
      });

    // Get current drugstore from localStorage
    const currentDrugstore = this._localStorage.retrieve('selected_drugstore');

    // Search drugstores using the current drugstore ID
    this._store.dispatch(new UpdateCurrentDrugstore(currentDrugstore.id));
  }

  clearValue() {
    this.textField.setValue('');
  }

  onSubmit() {
    const unmaskedCpf = unmaskCpf(this.textField.value);
    this._store.dispatch(new ResetCustomerErrors());
    this._store.dispatch(new GetCustomer(unmaskedCpf));
  }

  handleProceedWithoutCpf() {
    this._sessionStorage.store('selected_customer', {
      fullName: 'Cliente sem CPF',
      cpf: '0',
      products: [],
    });
  }
}
