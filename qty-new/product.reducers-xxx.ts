import { EProductActions, ProductActions } from '../actions/product.actions';
import { initialProductState, IProductState } from '../state/product.state';
import _ from 'lodash';

// Set default values and concat with current array
const setSelectedProducts = (state: any, payload: any) => {
  for (let i in payload) {

    const prices = {
      'Preço Base': { value: payload[i].basePrice },
      'Viva Saúde': { value: payload[i].fidelizationPrice ? payload[i].fidelizationPrice.value : null },
      'Convênio': { value: payload[i].convenioPrice ? payload[i].convenioPrice.value : null },
      'PBM': { value: payload[i].pbmPrice ? payload[i].pbmPrice.value : null },
      'Farm Popular': { value: payload[i].popularPrice ? payload[i].popularPrice.value : null },
      'DP': { value: payload[i].pdPrice ? payload[i].pdPrice.value : null },
    }

    // const prices = {
    //   'Preço Base': { value: payload[i].basePrice },
    //   'Viva Saúde': { value: payload[i].fidelizationPrice ? payload[i].fidelizationPrice.value : null },
    //   'Convênio': { value: payload[i].convenioPrice ? payload[i].convenioPrice.value : null },
    //   'PBM': { value: payload[i].pbmPrice ? payload[i].pbmPrice.value : null }
    // };

    const minPrice = _.minBy(_.values(prices), 'value');

    // const bestPrice = minPrice.value;
    const discount = payload[i].basePrice - minPrice.value;

    payload[i].quantity = payload[i].quantity !== 1 ? payload[i].quantity : 1;
    payload[i].selectedPrice = minPrice.value;
    payload[i].discount = parseFloat(discount.toFixed(2)) * payload[i].quantity;
    payload[i].discountType = _.findKey(prices, o => o.value === minPrice.value);
    payload[i].bestPrice = minPrice.value;
  }

  return {
    ...state,
    selectedProducts: _.concat(state.selectedProducts, payload)
  }
}

const lowestValue = (values: any) => {
  // Remove value: null
  var valid_keys = Object.keys(values).filter(k => values[k].value !== null);

  // Ordena por value
  var sorted_keys = valid_keys.sort((a, b) => values[a].value - values[b].value);
  var lowest_key = sorted_keys[0];
  var lowest = { 'key': lowest_key, 'value': values[lowest_key].value };

  return lowest;
}

const setInitialProducts = (payload: any) => {
  const settedProducts = payload;

  // @TODO: Criar metodo para melhorar o merge das infos de preços
  for (let i in settedProducts) {
    const prices = {
      'popularPrice': { value: settedProducts[i].popularPrice ? settedProducts[i].popularPrice.value : null },
      'pbmPrice': { value: settedProducts[i].pbmPrice ? settedProducts[i].pbmPrice.value : null },
      'convenioPrice': { value: settedProducts[i].convenioPrice ? settedProducts[i].convenioPrice.value : null },
      'pdPrice': { value: settedProducts[i].pdPrice ? settedProducts[i].pdPrice.value : null },
      'fidelizationPrice': { value: settedProducts[i].fidelizationPrice ? settedProducts[i].fidelizationPrice.value : null },
      'basePrice': { value: settedProducts[i].basePrice },
    }

    settedProducts[i].highlightedPrice = lowestValue(prices).key;
  }

  return settedProducts;
}

// Update any passed value in the selected products array
const updateProducts = (state: any, payload: any) => {
  const newSelection = state.selectedProducts.map((product: any) => {

    const prices = {
      'Preço Base': { value: payload.product.basePrice },
      'Viva Saúde': { value: payload.product.fidelizationPrice.value },
      'Convênio': { value: payload.product.convenioPrice ? payload.product.convenioPrice.value : null },
      'PBM': { value: payload.product.pbmPrice ? payload.product.pbmPrice.value : null },
      'Farm Popular': { value: payload.product.popularPrice ? payload.product.popularPrice.value : null },
      'DP': { value: payload.product.pdPrice ? payload.product.pdPrice.value : null },
    }

    // const priceValue = _.minBy(_.values(prices), 'value');
    // const discount = product.basePrice - priceValue.value;

    const updateProduct = () => {
      if (payload.property === 'selectedPrice') {
        const productDiscount = product.basePrice - payload.value;
        return {
          ...product,
          selectedPrice: payload.value,
          discount: payload.value === product.basePrice ? 0 : parseFloat(productDiscount.toFixed(2)),
          discountType: payload.value === product.basePrice ? 'Preço Base' : _.findKey(prices, o => o.value === payload.value),
        }
      }

      if (payload.property === 'quantity') {
        return {
          ...product,
          quantity: parseInt(payload.value),
        }
      }
    }

    if (product.sku === payload.product.sku) {
      return updateProduct()
    } else {
      return product
    }
  });

  return {
    ...state,
    selectedProducts: newSelection,
  }
}

const removeProduct = (state: any, payload: any) => {
  const newSelection = state.selectedProducts.filter((product: any) => product.sku !== payload);

  return {
    ...state,
    selectedProducts: newSelection
  }
}

export const productReducers = (
  state = initialProductState,
  action: ProductActions,
): IProductState => {
  switch (action.type) {
    case EProductActions.SetSelectedProducts: {
      return setSelectedProducts(state, action.payload);
    }

    case EProductActions.UpdateSelectedProducts: {
      return updateProducts(state, action.payload)
    }

    // case EProductActions.UpdateProductQuantity: {
    //   return updateProductQuantity(state, action.payload)
    // }

    case EProductActions.RemoveSelectedProduct: {
      return removeProduct(state, action.payload)
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
        //products: action.payload.products,
        products: setInitialProducts(action.payload.products),
        forms: action.payload.forms,
      };
    }
    case EProductActions.GetProductSearchWithCpf: {
      return {
        ...state,
        searchTerm: action.payload,
      };
    }
    case EProductActions.GetProductSearchWithCpfSuccess: {
      return {
        ...state,
        // products: action.payload.products,
        products: setInitialProducts(action.payload.products),
        forms: action.payload.forms,
      };
    }
    case EProductActions.PostProductCheckout: {
      return {
        ...state,
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
    case EProductActions.ResetSelectedProducts: {
      return {
        ...state,
        selectedProducts: initialProductState.selectedProducts,
      };
    }
    default:
      return state;
  }
};
