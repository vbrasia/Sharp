import { Injectable } from '@angular/core';
import { Repository } from '../models/repository';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {LogedIn} from '../models/logedIn.model';
import { Store } from '../models/store.model';
import {Authorization} from '../models/authorization.model';
@Injectable()
export class AuthenticationService {
    constructor(private repo: Repository, private router: Router, private localStorage: LocalStorage) {
        this.logedIn = new LogedIn;
     }
    authenticated = false;
    name: string;
    password: string;
    callbackUrl: string;
    logedIn: LogedIn;
    login(): Observable<boolean> {
        this.authenticated = false;
        return this.repo.login(this.name, this.password).map(response => {
            if (response.ok) {
                this.authenticated = true;
                this.logedIn.logedinUser = this.name;
                this.logedIn.logedinPassword = '';
                this.password = null;
                this.repo.logedinUser = this.name;
                this.router.navigateByUrl(this.callbackUrl || '/admin/stores');
                this.saveLogedIn(this.logedIn);
            }
            return this.authenticated;
        }).catch(e => {
            this.authenticated = false;
            return Observable.of(false);
        });
    }
    loggedIn() {
        this.authenticated = true;
        this.logedIn.logedinUser = this.name;
        this.logedIn.logedinPassword = this.password;
        this.password = null;
        this.repo.logedinUser = this.name;
        this.router.navigateByUrl(this.callbackUrl || '/admin/stores');
        this.saveLogedIn(this.logedIn);
    }
    logout() {
    this.authenticated = false;
    this.repo.logout();
    this.localStorage.clear().subscribe(() => {
        this.repo.logedinUser = null;
        this.repo.selecttedStore = null;
        this.router.navigateByUrl('/login');
        location.reload();
        });
    }
    /*saveLogedIn(logedIn: LogedIn) {
        this.localStorage.setItem('sharp', logedIn).subscribe(() => {});
    }*/
    saveLogedIn(logedIn: LogedIn) {
        this. getLogedIn().subscribe(response => {
            if (response) {
                if (response !== logedIn) {
                    this.localStorage.setItem('sharp', logedIn).subscribe(() => {});
                }
            } else {
                this.localStorage.setItem('sharp', logedIn).subscribe(() => {});
            }
        });
    }
    getLogedIn(): Observable<any> {
        return this.localStorage.getItem<LogedIn>('sharp');
    }
    getStore(): Observable<any> {
        return this.localStorage.getItem<Store>('store');
    }
    getAuthorizations(): Observable<any> {
        return this.localStorage.getItem<Authorization>('authorization');
    }
    getUserRole(): Observable<any> {
        return this.localStorage.getItem<string>('role');
    }
}
