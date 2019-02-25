import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Product {
  id: any;
  skuId: any;
  title: string;
  description: string;
  listPrice: string;
  salesPrice: string;
  loyalityPrice: string;
  agreementsPrice: string;
  pbmPrice: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductBFFService {
  private _url: string = environment.services.productBff;

  constructor (private http: HttpClient) { }

  getProducts(_params: object) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    let params = new HttpParams();
    Object.keys(_params).forEach(function (key) {
      params = params.append(key, _params[key]);
    });

    let options = { headers: headers, method: 'get', params: params };

    return this.http.get<Product[]>(`${this._url}/products`, options);
  }
}
