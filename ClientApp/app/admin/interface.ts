import { Injectable } from '@angular/core';
import { Repository } from '../models/repository';
import {Store} from '../models/store.model';
import {Authorization} from '../models/authorization.model';
import { Router } from '@angular/router';
import {TreeEvents} from './treeEvents';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class Interface {
    selectedNode?: string;
    selectedChild?: string;
    toggle?: number;
    constructor(private repo: Repository, private localStorage: LocalStorage, private router: Router, private events: TreeEvents) {
        this.toggle = 1;
        if (this.repo.screenWidth <= 1024) {
            this.toggle = 1;
        } else {
            this.toggle = -1;
        }
        this.selectedNode = 'Stores';
        this.selectedChild = '';
        this.getRootTag().subscribe(response => {
            if (response) {
                const tag = response;
                this.routeNode(tag);
            }
        });
        this.getChildTag().subscribe(response => {
            if (response) {
                const tag = response;
                this.setChild(tag);
            }
        });
    }
    clickToggle() {
        this.toggle = -1 * this.toggle;
    }
    get screenWidth(): number {
        return this.repo.screenWidth;
    }
    getToggle(): number {
        return this.toggle;
    }
    getStore(): Store {
        return this.repo.selecttedStore;
    }

    get authorizationRoot(): Authorization[] {
        if (this.repo.userRole === 'Admin') {
            return this.repo.authorizations.filter(x => (x.type === 'Root' && x.admin && x.backOffice)).sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if ( lineDiff ) {return lineDiff; }
            });
        } else
        if (this.repo.userRole === 'Supervisor') {
            return this.repo.authorizations.filter(x => (x.type === 'Root' && x.supervisor && x.backOffice)).sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if ( lineDiff ) {return lineDiff; }
            });
        } else
        if (this.repo.userRole === 'Manager') {
            return this.repo.authorizations.filter(x => (x.type === 'Root' && x.manager && x.backOffice)).sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if ( lineDiff ) {return lineDiff; }
            });
        } else
        if (this.repo.userRole === 'Cashier') {
            return this.repo.authorizations.filter(x => (x.type === 'Root' && x.cashier && x.backOffice)).sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if ( lineDiff ) {return lineDiff; }
            });
        } else {
            return this.repo.authorizations.filter(x => (x.type === 'Root' && x.backOffice)).sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if ( lineDiff ) {return lineDiff; }
            });
        }
    }
    get authorizationChild() {
        if (this.repo.userRole === 'Admin') {
            return this.repo.authorizations.filter(x => x.rootTag === this.selectedNode)
            .filter(x => (x.type === 'Child' && x.admin && x.backOffice ))
            .sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if (lineDiff) {return lineDiff; }
            });
        } else
        if (this.repo.userRole === 'Supervisor') {
            return this.repo.authorizations.filter(x => x.rootTag === this.selectedNode)
            .filter(x => (x.type === 'Child' && x.supervisor && x.backOffice ))
            .sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if (lineDiff) {return lineDiff; }
            });
        } else
        if (this.repo.userRole === 'Manager') {
            return this.repo.authorizations.filter(x => x.rootTag === this.selectedNode)
            .filter(x => (x.type === 'Child' && x.manager && x.backOffice ))
            .sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if (lineDiff) {return lineDiff; }
            });
        } else
        if (this.repo.userRole === 'Cashier') {
            return this.repo.authorizations.filter(x => x.rootTag === this.selectedNode)
            .filter(x => (x.type === 'Child' && x.cashier && x.backOffice ))
            .sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if (lineDiff) {return lineDiff; }
            });
        } else {
            return this.repo.authorizations.filter(x => x.rootTag === this.selectedNode)
            .filter(x => (x.type === 'Child' && x.backOffice)).sort((a, b) => {
                const lineDiff =  a.lineNo - b.lineNo;
                if (lineDiff) {return lineDiff; }
            });
        }
    }
    getAuthorizationChild(tag: string): Authorization[] {
        if (tag === this.selectedNode) {
            if (this.repo.userRole === 'Admin') {
                return this.repo.authorizations.filter(x => x.rootTag === tag)
                .filter(x => (x.type === 'Child' && x.admin && x.backOffice ))
                .sort((a, b) => {
                    const lineDiff =  a.lineNo - b.lineNo;
                    if (lineDiff) {return lineDiff; }
                });
            } else
            if (this.repo.userRole === 'Supervisor') {
                return this.repo.authorizations.filter(x => x.rootTag === tag)
                .filter(x => (x.type === 'Child' && x.supervisor && x.backOffice ))
                .sort((a, b) => {
                    const lineDiff =  a.lineNo - b.lineNo;
                    if (lineDiff) {return lineDiff; }
                });
            } else
            if (this.repo.userRole === 'Manager') {
                return this.repo.authorizations.filter(x => x.rootTag === tag)
                .filter(x => (x.type === 'Child' && x.manager && x.backOffice ))
                .sort((a, b) => {
                    const lineDiff =  a.lineNo - b.lineNo;
                    if (lineDiff) {return lineDiff; }
                });
            } else
            if (this.repo.userRole === 'Cashier') {
                return this.repo.authorizations.filter(x => x.rootTag === tag)
                .filter(x => (x.type === 'Child' && x.cashier && x.backOffice ))
                .sort((a, b) => {
                    const lineDiff =  a.lineNo - b.lineNo;
                    if (lineDiff) {return lineDiff; }
                });
            } else {
                return this.repo.authorizations.filter(x => x.rootTag === tag)
                .filter(x => (x.type === 'Child' && x.backOffice)).sort((a, b) => {
                    const lineDiff =  a.lineNo - b.lineNo;
                    if (lineDiff) {return lineDiff; }
                });
            }
        }
    }
    getSelectedNodeIcon(tag: string): string {
        return tag === this.selectedNode ? 'fa fa-caret-down' : 'fa fa-caret-right';
    }
    setNode(tag: string) {
        if (tag) {
            this.selectedChild = '';
            this.localStorage.removeItem('childTag').subscribe(() => {
               this.routeNode(tag);
            });
        }
    }
    private routeNode(tag: string) {
        if (tag) {
            this.saveRootTag(tag);
            this.selectedNode = tag;
            if (tag === 'Stores') {this.router.navigateByUrl('/admin/stores'); } else
            if (tag === 'Home') {this.router.navigateByUrl('/admin/nodes'); } else
            if (tag === 'Dashboard') {this.router.navigateByUrl('/admin/dashboard'); } else {
                this.router.navigateByUrl('/admin/childs'); }
        }
    }
    setChild(tag: string) {
        if (tag) {
            this.saveChildTag(tag);
            this.selectedChild = tag;
            this.events.event(tag);
        }
    }
    saveRootTag(tag: string) {
        this.getRootTag().subscribe(response => {
            if (response) {
                if (response !== tag) {
                    this.localStorage.setItem('rootTag', tag).subscribe(() => {});
                }
            } else {
                this.localStorage.setItem('rootTag', tag).subscribe(() => {});
            }
        });
    }
    getRootTag(): Observable<string> {
        return this.localStorage.getItem<string>('rootTag');
    }
    saveChildTag(tag: string) {
        this.getChildTag().subscribe(response => {
            if (response) {
                if (response !== tag) {
                    this.localStorage.setItem('childTag', tag).subscribe(() => {});
                }
            } else {
                this.localStorage.setItem('childTag', tag).subscribe(() => {});
            }
        });
    }
    getChildTag(): Observable<string> {
        return this.localStorage.getItem<string>('childTag');
    }
}
