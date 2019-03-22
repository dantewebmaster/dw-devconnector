export interface IProductHttp {
  products: IProduct[];
  forms: object[];
}


export interface IPrice {
  value: number;
  percent: number;
}

export interface IProduct {
  pbm: number;
  sku: string;
  ean: string;
  shortName: string;
  typification: string;
  brand: string;
  concentration: string;
  activeIngredient: string;
  form: string;
  volume?: any;
  popular: boolean;
  stock: string;
  prescription?: any;
  selling: number;
  basePrice: number;
  fidelizationPrice: IPrice;
  convenioPrice?: IPrice;
  pbmPrice?: IPrice;
  popularPrice?: IPrice;
  pdPrice?: IPrice;
}

export interface ISelectedProduct extends IProduct {
  quantity: number;
  selectedPrice: number;
}
