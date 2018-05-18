import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Subscription} from "rxjs/Subscription";
import {Product} from '../../interfaces/interfaces';
import {Constants} from '../../constants/constants';

/*
  Generated class for the RequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestProvider {

  constructor(public http: HttpClient, private consts: Constants) {
  }

  //execute https-request to fetch all products
  //returns an array of Product-objects
  public getProducts() : Observable<Array<Product>>{
    return this.http.get<Array<Product>>(this.consts.url+"shop");
  }

  public getDescription(prID: number) : Observable<Product>{
    return this.http.post<Product>(this.consts.url+"product", {
      prodID : prID
    });
  }

}
