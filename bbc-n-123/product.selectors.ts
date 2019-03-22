import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { IProductState } from '../state/product.state';

const selectProductState = (state: IAppState) => state.product;

export const selectSelectedProducts = createSelector(
  selectProductState,
  (state: IProductState) => state.selectedProducts
);

export const selectProducts = createSelector(
  selectProductState,
  (state: IProductState) => state.products
);

export const selectProductErrors = createSelector(
  selectProductState,
  (state: IProductState) => state.errors
);

export const selectSearchTerm = createSelector(
  selectProductState,
  (state: IProductState) => state.searchTerm
);
