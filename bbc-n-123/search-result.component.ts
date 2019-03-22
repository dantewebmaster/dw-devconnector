import { Component, OnInit, OnDestroy } from '@angular/core';
import { IStep } from 'src/app/models/stepper.interface';
import { Store, select } from '@ngrx/store';
import {
  selectProductErrors,
  selectProducts,
  selectSearchTerm,
  selectSelectedProducts,
} from '../../store/selectors/product.selectors';
import { IAppState } from '../../store/state/app.state';
import {
  ResetErrors,
  ResetProducts,
  SelectProduct,
  UpdateSelectedProducts,
} from '../../store/actions/product.actions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { IProduct, ISelectedProduct } from 'src/app/models/product.interface';

import {
  FormGroup,
  FormBuilder,

  Validators,
  FormControl
} from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {



  selectedProducts$ = this._store.pipe(select(selectSelectedProducts))
    .subscribe(res => {
      return this.selectedProducts$ = res;
    })

  // dataSource = null;

  // products$ = this._store.pipe(select(selectProducts).subscribe(res => {
  //   this.dataSource = new MatTableDataSource<IProduct>(res);
  // }));

  products$ = this._store.pipe(select(selectProducts));
  // .subscribe((res) => {
  //   this.dataSource = new MatTableDataSource<IProduct>(res);
  // });

  searchTerm$ = this._store.select(selectSearchTerm);


  errors$ = this._store.select(selectProductErrors);

  productQuantityField = new FormControl(1, [Validators.min(0), Validators.max(99)]);
  public maskQuantity = [/\d/, /\d/];

  dataSource = new MatTableDataSource<IProduct>();

  selection = new SelectionModel<ISelectedProduct>(true, []);

  constructor (
    private _store: Store<IAppState>,
  ) { }

  ngOnInit() {
    this.getProductsPrices();

    this.productQuantityField.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(newValue => {
        console.log(newValue)
      })

    this.selection.changed
      .pipe(distinctUntilChanged())
      .subscribe(({ source }) => {
        console.log(source.selected)
        this._store.dispatch(new SelectProduct(source.selected))
      })
  }

  incrementValue(input, sku, property) {
    let value = input.value
    if (input.value < 99) {
      value++
      this.updateValue(value, sku, property)
    }

  }
  decrementValue(input, event) {
    if (input.value > 0)
      input.value--
  }
  updateValue(value, sku, property) {
    console.log(event.target)
    console.log(value)
    console.log(sku)

    const payload = {
      sku,
      value,
      property,
    }

    this._store.dispatch(new UpdateSelectedProducts(payload))
  }

  steps: IStep[] = [
    { title: 'Cliente', completed: true, active: false },
    { title: 'Qual Produto?', completed: true, active: false },
    { title: 'Resultado', completed: false, active: true },
    { title: 'Passo 4', completed: false, active: false },
  ];

  displayedColumns: string[] = [
    'select',
    'type',
    'name',
    'dosage',
    'stock',
    'basePrice',
    'vsPrice',
    'medicalAgreement',
    'pbm',
    'popFarm',
    'progressiveDiscount',
    'quantity',
    'prescription',
  ];

  getProductsPrices() {
    this._store.select(selectProducts).subscribe(resp => {
      this.dataSource = new MatTableDataSource<IProduct>(resp);
    });
  }

  ngOnDestroy() {
    this._store.dispatch(new ResetErrors());
    this._store.dispatch(new ResetProducts());
  }
}
