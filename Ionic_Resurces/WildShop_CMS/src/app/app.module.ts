import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {OrderDetailPage} from '../pages/order-detail/order-detail';
import {OrdersPage} from '../pages/orders/orders';
import {ProductsPage} from '../pages/products/products';
import {ProductDetailPage} from '../pages/product-detail/product-detail';
import {NewPasswordPage} from '../pages/new-password/new-password';
import {RegisterPage} from '../pages/register/register';
import { RequestsProvider } from '../providers/requests/requests';
import {Constants} from '../Constants/constants';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    OrdersPage,
    ProductsPage,
    OrderDetailPage,
    ProductDetailPage,
    RegisterPage,
    NewPasswordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    OrdersPage,
    ProductsPage,
    OrderDetailPage,
    ProductDetailPage,
    RegisterPage,
    NewPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RequestsProvider,
    Constants
  ]
})
export class AppModule {}
