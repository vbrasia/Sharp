import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Filter } from './configClasses.repository';
import { ErrorHandlerService, ValidationError } from '../errorHandler.service';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

import {Store} from './store.model';
import {UserStore} from './userStore.model';
import {Authorization} from './authorization.model';
import {StoreDto} from './storeDto.model';
import {DepartmentDto} from './departmentDto.model';

const storesUrl = '/api/stores';
const usersUrl = '/api/users';
const authorizationUrl = '/api/authorizations';

@Injectable()
export class Repository {
    reLogin?: boolean;
    private filterObject = new Filter();
    apiBusy?: boolean;
    selecttedStore?: Store;
    stores?: Store[];
    userStores?: UserStore[];
    authorizations?: Authorization[];
    logedinUser?: string;
    private loggedInUserRole?: string;
    storeDto?: StoreDto;
    screenWidth?: number;
    constructor(private http: Http, private localStorage: LocalStorage, private router: Router) {
        this.reLogin = false;
        this.apiBusy = false;
        this.authorizations = [];
        this.getAuthorizations();
        this.storeDto = new StoreDto();
    }
    login(name: string, password: string): Observable<Response> {
        return this.http.post('/api/account/login', { name: name, password: password});
    }
    logout() {
        this.http.post('/api/account/logout', null).subscribe(respone => {});
    }
    public sendRequest(verb: RequestMethod, url: string, data?: any): Observable<any> {
        return this.http.request(new Request({
            method: verb, url: url, body: data})).map(response => {
                return response.headers.get('Content-Length') !== '0' ? response.json() : null;
            }).catch((errorResponse: Response) => {
                if (errorResponse.toString().indexOf('Unexpected token') >= 0) {
                    this.localStorage.clear().subscribe(() => {
                        this.reLogin = true;
                        this.router.navigateByUrl('/login');
                        location.reload();
                    });
                    throw new Error('Please wait');
                }
                if (errorResponse.status === 400 ) {
                    let jsonData: string;
                    try {
                        jsonData = errorResponse.json();
                    } catch (e) {
                        // throw new Error('Network Error');
                        throw new Error(errorResponse.toString());
                    }
                    const messages = Object.getOwnPropertyNames(jsonData).map(p => jsonData[p]);
                    throw new ValidationError(messages);
                }
                // throw new Error('Network Error');
                throw new Error(errorResponse.toString());
            });
        }
    public getStores() {
        const url = storesUrl + '/' + this.logedinUser;
        this.sendRequest(RequestMethod.Get, url)
        .subscribe(response => {
            this.stores = response;
        });
    }
    public getAuthorizations() {
        this.sendRequest(RequestMethod.Get, authorizationUrl)
        .subscribe(response => {
            this.authorizations = response;
            this.saveAuthorizations(this.authorizations);
        });
    }
    private saveAuthorizations(authorizations: Authorization[]) {
        this.localStorage.setItem('authorization', authorizations).subscribe(() => {});
    }
    /*get todayDate(): string {
        const d = new Date(Date.now());
        const ds = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + d.getDate().toString();
        return ds;
    }
    get nextDayDate(): string {
        const d = new Date(Date.now());
        d.setDate( d.getDate() + 1 );
        const ds = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + d.getDate().toString();
        return ds;
    }*/
    public setStoreDto() {
        this.storeDto.id = this.selecttedStore.id;
        this.storeDto.address = this.selecttedStore.address;
        this.storeDto.city = this.selecttedStore.city;
        this.storeDto.dataBase = this.selecttedStore.dataBase;
        this.storeDto.port = this.selecttedStore.port;
        this.storeDto.postCode = this.selecttedStore.postCode;
        this.storeDto.publicIp = this.selecttedStore.publicIp;
        this.storeDto.storeId = this.selecttedStore.storeId;
        this.storeDto.storeName = this.selecttedStore.storeName;
        this.storeDto.serialNumber =  this.selecttedStore.serialNumber;
        this.storeDto.macAddress = this.selecttedStore.macAddress;
        this.storeDto.tick = this.selecttedStore.tick;

        if (this.selecttedStore) {
            const url = usersUrl + '?' + 'storeId=' + this.selecttedStore.storeId;
            this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => {
                this.userStores = response;
                this.loggedInUserRole = this.userStores.filter(x => x.userId === this.logedinUser).map(y => y.userRole)[0];
                this.saveUserRole(this.loggedInUserRole);
                });
            }
    }
    private saveUserRole(role: string) {
        this.localStorage.setItem('role', role).subscribe(() => {});
    }
    get userRole(): string {
        if (this.loggedInUserRole) {
            return this.loggedInUserRole;
        } else {
            return 'Admin';
        }
    }
    set userRole(value: string) {
        this.loggedInUserRole = value;
    }
    public getUsers() {
        if (this.selecttedStore) {
            const url = usersUrl + '?' + 'storeId=' + this.selecttedStore.storeId;
            this.sendRequest(RequestMethod.Get, url)
            .subscribe(response => {
                this.userStores = response;
            });
        }
    }
    get chartBackgroundColor() {
        return [
            'rgb(255, 0, 0)',
            'rgb(0, 51, 204)',
            'rgb(0, 204, 102)',
            'rgb(230, 230, 0)',
            'rgb(102, 0, 51)',
            'rgb(255, 77, 77)',
            'rgb(26, 0, 0)',
            'rgb(153, 0, 0)',
            'rgb(0, 77, 153)',
            'rgb(153, 102, 51)',
            'rgb(255, 255, 0)',
            'rgb(0, 51, 0)',
            'rgb(153, 0, 115)',
            'rgb(255, 51, 255)',
            'rgb(136, 204, 0)',
            'rgb(51, 153, 255)',
            'rgb(230, 153, 0)',
            'rgb(230, 0, 0)',
            'rgb(255, 204, 0)',
            'rgb(153, 204, 0)',
            'rgb(179, 179, 179)',
            'rgb(0, 51, 0)',
            'rgb(0, 230, 230)',
            'rgb(198, 26, 255)',
            'rgb(204, 102, 153)'
        ];
    }
    get chartBorderColor() {
        return [
            'rgb(255, 0, 0)',
            'rgb(0, 51, 204)',
            'rgb(0, 204, 102)',
            'rgb(230, 230, 0)',
            'rgb(102, 0, 51)',
            'rgb(255, 77, 77)',
            'rgb(26, 0, 0)',
            'rgb(153, 0, 0)',
            'rgb(0, 77, 153)',
            'rgb(153, 102, 51)',
            'rgb(255, 255, 0)',
            'rgb(0, 51, 0)',
            'rgb(153, 0, 115)',
            'rgb(255, 51, 255)',
            'rgb(136, 204, 0)',
            'rgb(51, 153, 255)',
            'rgb(230, 153, 0)',
            'rgb(230, 0, 0)',
            'rgb(255, 204, 0)',
            'rgb(153, 204, 0)',
            'rgb(179, 179, 179)',
            'rgb(0, 51, 0)',
            'rgb(0, 230, 230)',
            'rgb(198, 26, 255)',
            'rgb(204, 102, 153)'
        ];
    }
    get filter(): Filter {
        return this.filterObject;
    }
}
