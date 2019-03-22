import { EProductActions, ProductActions } from '../actions/product.actions';
import { initialProductState, IProductState } from '../state/product.state';

// Update any passed value in the selected products array
const updateSelectedProducts = (state: any, payload: any) => {
  const updatedProducts = state.selectedProducts.map((product: any) =>
    product.sku === payload.sku ? {
      ...product,
      [payload.property]: payload.value,
    } : product,
  )

  return {
    ...state,
    selectedProducts: updatedProducts
  }
}

export const productReducers = (
  state = initialProductState,
  action: ProductActions,
): IProductState => {
  switch (action.type) {
    case EProductActions.SelectProduct: {
      return {
        ...state,
        selectedProducts: action.payload,
      };
    }

    case EProductActions.UpdateSelectedProducts: {
      return updateSelectedProducts(state, action.payload)
    }

    case EProductActions.GetProductFastSearch: {
      return {
        ...state,
        searchTerm: action.payload,
      };
    }
    case EProductActions.GetProductFastSearchSuccess: {
      return {
        ...state,
        //searchTerm: action.payload,
      };
    }
    case EProductActions.GetProductSearch: {
      return {
        ...state,
        searchTerm: action.payload,
      };
    }
    case EProductActions.GetProductSearchSuccess: {
      return {
        ...state,
        products: action.payload.products,
        forms: action.payload.forms,
      };
    }
    case EProductActions.GetProductSearchWithCpf: {
      return {
        ...state,
        searchTerm: action.payload.text,
      };
    }
    case EProductActions.GetProductSearchWithCpfSuccess: {
      return {
        ...state,
        products: action.payload.products,
        forms: action.payload.forms,
      };
    }
    case EProductActions.SetError: {
      return {
        ...state,
        errors: action.payload,
      };
    }
    case EProductActions.ResetErrors: {
      return {
        ...state,
        errors: initialProductState.errors,
      };
    }
    case EProductActions.ResetProducts: {
      return {
        ...state,
        products: initialProductState.products,
      };
    }
    default:
      return state;
  }
};
