import { Component } from '@angular/core';
import {Repository} from '../models/repository';

import {Store} from '../models/store.model';
import { Interface } from './interface';
@Component({
templateUrl: 'admin.component.html'
})
export class AdminComponent {
    constructor(private repo: Repository, public inter: Interface) {}

    get store(): Store {
        return this.repo.selecttedStore;
    }
    get apiBusy() {
        return this.repo.apiBusy;
    }
}
