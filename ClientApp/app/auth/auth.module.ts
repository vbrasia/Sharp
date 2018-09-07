import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AuthenticationComponent } from './authentication.component';
import { AuthenticationGuard } from './authentication.guard';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
@NgModule({
    imports: [RouterModule, FormsModule, BrowserModule, LocalStorageModule],
    declarations: [AuthenticationComponent],
    providers: [AuthenticationService, AuthenticationGuard],
    exports: [AuthenticationComponent]
})
export class AuthModule { }
