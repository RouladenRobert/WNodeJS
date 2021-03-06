import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';
import { ShopPage } from '../pages/shop/shop';
import { InformationPage } from '../pages/information/information';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RequestProvider } from '../providers/request/request';
import { DescriptionPage } from '../pages/description/description';
import { OrderPage } from '../pages/order/order';
import {Constants} from '../constants/constants';
import { ConfirmationPage } from '../pages/confirmation/confirmation';
import { LogoutPage } from '../pages/logout/logout';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactPage,
    ShopPage,
    InformationPage,
    LoginPage,
    RegisterPage,
    DescriptionPage,
    OrderPage,
    ConfirmationPage,
    LogoutPage
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
    ContactPage,
    ShopPage,
    InformationPage,
    LoginPage,
    RegisterPage,
    DescriptionPage,
    OrderPage,
    ConfirmationPage,
    LogoutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RequestProvider,
    Constants
  ]
})
export class AppModule {}
