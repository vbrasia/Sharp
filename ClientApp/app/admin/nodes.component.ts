import { Component } from '@angular/core';
import {Interface} from './interface';
import { Router } from '@angular/router';
@Component({
    selector: 'app-nodes',
    templateUrl: 'nodes.component.html'
    })
    export class NodesComponent {
        constructor(public inter: Interface, private router: Router) {
            if (!inter.getStore()) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                this.inter.setNode('Home');
            }
        }
    }
