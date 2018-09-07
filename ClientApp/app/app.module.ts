import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ModelModule } from './models/model.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

import { ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from './errorHandler.service';
import { AngularResizedEventModule } from 'angular-resize-event';

import {RoutingConfig} from './app.routing';

import { AppComponent } from './app.component';

const eHandler = new ErrorHandlerService();
export function handler() {
  return eHandler;
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AngularResizedEventModule, FormsModule, HttpModule, ModelModule, RoutingConfig,
    AuthModule, AdminModule],
  providers: [{ provide: ErrorHandlerService, useFactory: handler}, { provide: ErrorHandler, useFactory: handler}],
  bootstrap: [AppComponent]
})
export class AppModule { }
