import { Component } from '@angular/core';

import { AuthenticationService } from '../auth/authentication.service';
import {Interface} from './interface';

@Component({
    selector: 'app-topbar',
    templateUrl: 'topbar.component.html'
    })
    export class TopbarComponent {
        constructor(public authService: AuthenticationService, public inter: Interface) {}

        get screenWidth(): number {
            return this.inter.screenWidth;
        }
    }
