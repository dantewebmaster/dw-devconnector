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
  UpdateSelectedProducts,
  SetSelectedProducts,
  RemoveSelectedProduct,
  ResetErrors,
  ResetProducts,
  ResetSelectedProducts,
  UpdateProductQuantity,
} from '../../store/actions/product.actions';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import {
  IProduct,
  // ISelectedProduct
} from 'src/app/models/product.interface';
import { distinctUntilChanged } from 'rxjs/operators';
import { SessionStorageService, SessionStorage } from 'ngx-webstorage';
import { ICustomer } from '../../models/customer.interface';
import _ from 'lodash';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  @SessionStorage('selected_customer')
  public selectedCustomer: ICustomer;

  public selectedProducts;

  // Need unsubscribe...
  selectedProducts$ = this._store.pipe(select(selectSelectedProducts))
    .subscribe(res => this.selectedProducts = res);

  // products$ = this._store.pipe(select(selectProducts));
  // Need unsubscribe...
  searchTerm$ = this._store.pipe(select(selectSearchTerm)).subscribe(searchTerm => this.searchTerm$ = searchTerm);
  errors$ = this._store.select(selectProductErrors);

  // ...
  public subTotal: number;
  // public cartTotalQuantity: number;

  // selection = new SelectionModel<ISelectedProduct>(true, []);
  selection = new SelectionModel<IProduct>(true, []);

  // Populate data source with selected products
  dataSource = this._store.select(selectProducts).subscribe(res => {
    return this.dataSource = new MatTableDataSource<IProduct>(res);
  });

  // ...
  // show = false;

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

  public itemsCart: number;

  constructor(
    private _store: Store<IAppState>,
    private _sessionStorage: SessionStorageService,
  ) { }

  ngOnInit() {
    this.selectedCustomer = this._sessionStorage.retrieve('selected_customer');

    // Update Store on selction change
    this.selection.changed
      .pipe(distinctUntilChanged())
      .subscribe(newSelection => {
        if (newSelection.added.length > 0) {
          this._store.dispatch(new SetSelectedProducts(newSelection.added));
        }
        if (newSelection.removed.length > 0) {
          console.log('Removendo item... ', newSelection.removed)
          newSelection.removed.map(product => this._store.dispatch(new RemoveSelectedProduct(product)));
        }
      });

    this.getItemsCart(this.selectedCustomer.products);
  }

  ngOnDestroy() {
    this._store.dispatch(new ResetErrors());
    this._store.dispatch(new ResetProducts());
  }

  // incrementValue(product) {
  //   // this.selection.select(product);
  //   if (product.quantity < 99) {
  //     this.updateValue(product.quantity += 1, product, 'quantity')
  //   }
  // }
  // decrementValue(product) {
  //   if (product.quantity > 0) {
  //     this.updateValue(product.quantity -= 1, product, 'quantity')
  //   }
  // }

  updateValue(value, product, property) {
    if(value !== '') {
      this.selection.select(product);
      if (property === 'quantity' && parseInt(value) === 0) {
        this.removeProductFromSubtotal(product.sku);
      }
      const payload = { product, value, property };
      this._store.dispatch(new UpdateSelectedProducts(payload));
      console.log(value)
    }
  }

  // updateProductQuantity(value, product) {
  //   if (value === 0) {
  //     this.removeProductFromSubtotal(product.sku);
  //   }
  //   const payload = { product, value };
  //   this._store.dispatch(new UpdateProductQuantity(payload));
  // }

  removeProductFromSubtotal(sku) {
    // Get current product table
    const productToRemove = _.find(this.dataSource.data, { 'sku': sku });
    // Deselect from table only if productToRemove exists on view
    if (productToRemove) {
      this.selection.deselect(productToRemove);
    }
    this._store.dispatch(new RemoveSelectedProduct(productToRemove ? productToRemove.sku : sku));
  }

  addSelectedProductsToCart(products) {
    const selectedCustomer = this._sessionStorage.retrieve('selected_customer');

    // Merging current product with new ones... not finished
    const grouped = _.chain([...products, ...selectedCustomer.products])
      .groupBy('sku')
      .map(function (objects, guid) {
        return {
          sku: guid,
          quantity: _.sumBy(objects, 'quantity')
        };
      })
      .value();
    console.log(grouped);


    const updatedCustomer = {
      ...selectedCustomer,
      products: selectedCustomer.products.concat(products),
      // products: selectedCustomer.products.concat(products),
    }
    console.log(updatedCustomer);
    this._sessionStorage.store('selected_customer', updatedCustomer);

    products.map(product => this.removeProductFromSubtotal(product.sku));

    this._store.dispatch(new ResetSelectedProducts());

    this.getItemsCart(this.selectedCustomer.products);
  }

  getItemsCart(products) {
    this.itemsCart = _.sumBy(products, p => parseInt(p.quantity));

    // this.itemsCart = _.sumBy(products, function (product) {
    //   return parseInt(product.quantity);
    // });

    // const result = _.map(currentProducts, function (obj) {
    //   return _.assign(obj, _.find(newProducts, {
    //     sku: obj.sku
    //   }));
    // });

    // return _(currentProducts)
    //   .groupBy('sku')
    //   .map((objs, key) => ({
    //     ...objs,
    //     'sku': key,
    //     'quantity': _.sumBy(objs, 'quantity')
    //   }))
    //   .value();
  }

  // toggleDetails(product) {
  //   console.log(product);
  //   product.show = !product.show;
  // }

  selectionChanged(event, row) {
    this.selection.toggle(row);
    if (!event.checked) {
      // this.resetProductQuantity()
      this.removeProductFromSubtotal(row.sku)
    }
  }

  // getSelectedProductQuantity(sku) {
  //   const productQuantity = _.values(this.selectedProducts, p => p.sku === sku);
  //   _.findKey(this.selectedProducts, o => o.value === payload.value)
  //   console.log(productQuantity)
  //   return productQuantity
  // }

  // resetProductQuantity() {
  //   console.log('zerando...')
  //   return true;
  // }
}
