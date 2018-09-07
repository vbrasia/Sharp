import { Component } from '@angular/core';
import {Interface} from './interface';
import { Repository } from '../models/repository';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: 'breadcrumb.component.html'
    })
    export class BreadcrumbComponent {
        constructor(public inter: Interface, private repo: Repository) {}

        get isStoreSelected(): boolean {
            if (this.repo.selecttedStore) {
                return true;
            } else {
                return false;
            }
        }

        get selectedNode(): string {
            if ((this.inter.selectedNode === 'Stores') || (this.inter.selectedNode === 'Home') ) {
                return '';
            } else {
                return this.inter.selectedNode;
            }
        }

        get selectedChild(): string {
            return this.inter.selectedChild;
        }
    }
