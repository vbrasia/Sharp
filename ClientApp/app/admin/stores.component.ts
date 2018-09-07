import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Store } from '../models/store.model';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs/Observable';
import { Interface } from './interface';
import { Report } from './report';
import { Dashboard } from './dashboard';
@Component({
    templateUrl: 'stores.component.html'
    })
    export class StoresComponent implements OnInit {
        constructor(private repo: Repository, private report: Report, private inter: Interface,
             private router: Router, private localStorage: LocalStorage, private dashboared: Dashboard) {}
        ngOnInit() {
            this.inter.setNode('Stores');
            this.repo.getStores();
        }
        get stores(): Store[] {
            return this.repo.stores;
        }
        setStore(store: Store) {
            if (this.repo.selecttedStore !== store) {
                this.report.reset();
                this.dashboared.reset();
            }
            this.repo.selecttedStore = store;
            this.repo.setStoreDto();
            this.saveStore(store);
        }
        /*saveStore(store: Store) {
            this.localStorage.setItem('store', store).subscribe(() => {
                this.repo.selecttedStore = store;
                this.router.navigateByUrl('/admin/nodes');
            });
        }*/
        saveStore(store: Store) {
            this.repo.selecttedStore = store;
            this.getStore().subscribe(response => {
                if (response) {
                    if (response !== store) {
                        this.localStorage.setItem('store', store).subscribe(() => {
                            this.router.navigateByUrl('/admin/nodes');
                        });
                    } else {
                        this.router.navigateByUrl('/admin/nodes');
                    }
                } else {
                    this.localStorage.setItem('store', store).subscribe(() => {
                        this.router.navigateByUrl('/admin/nodes');
                    });
                }
            });
        }
        getStore(): Observable<any> {
            return this.localStorage.getItem<Store>('store');
        }
    }
