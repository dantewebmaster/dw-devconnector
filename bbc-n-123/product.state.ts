import { IError } from 'src/app/models/error.interface';
import { IProductHttp, IProduct } from 'src/app/models/product.interface';

export interface IProductState {
  searchTerm: string;
  products: IProduct[];
  forms: object[];
  selectedProducts: object[];
  errors: IError;

  subTotal: object[];
  cart: object[];
}

export const initialProductState: IProductState = {
  searchTerm: '',
  products: null,
  forms: null,
  selectedProducts: null,
  errors: null,

  subTotal: null,
  cart: null,
}
