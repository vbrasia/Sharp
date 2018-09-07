import { Injectable } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
@Injectable()
export class TreeEvents {
    constructor(private repo: Repository, private router: Router) {}
    public event(tag?: string) {
        if (tag === 'Department Sales') {
            this.router.navigateByUrl('/admin/departmentsSales');
        } else
        if (tag === 'Item Sales') {
            this.router.navigateByUrl('/admin/itemsSales');
        } else
        if (tag === 'Daily Sales') {
            this.router.navigateByUrl('/admin/dailySales');
        } else
        if (tag === 'Transactions') {
            this.router.navigateByUrl('/admin/transactions');
        } else
        if (tag === 'Void Transactions') {
            this.router.navigateByUrl('/admin/voids');
        } else
        if (tag === 'Refund Transactions') {
            this.router.navigateByUrl('/admin/refunds');
        }
    }
}
