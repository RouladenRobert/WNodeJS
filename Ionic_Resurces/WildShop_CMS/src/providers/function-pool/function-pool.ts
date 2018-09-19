import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {RequestsProvider} from '../requests/requests';
import {Session } from '../../interfaces/interfaces';

/*
  Generated class for the FunctionPoolProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FunctionPoolProvider {

  constructor(public http: HttpClient, private reqProv : RequestsProvider) {
    console.log('Hello FunctionPoolProvider Provider');
  }

  public logout(session : Session, navCtrl, page){
    this.reqProv.logout(session).subscribe(res => {
      navCtrl.push(page);
    }, err => {
      console.log(err);
    });
  }

}
