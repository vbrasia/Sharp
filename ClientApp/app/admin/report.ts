import { Injectable } from '@angular/core';
import {DepartmentDto} from '../models/departmentDto.model';
import {ItemDto} from '../models/itemDto.model';
import {Period} from '../models/period.model';
import { DailySalesDto } from '../models/dailySalesDto.model';
import { Transactions } from '../models/transactions.model';
import { TransactionHeaders } from '../models/transactionHeaders.model';
@Injectable()
export class Report {
    departmentSalesPeriod?: Period;
    departmentsSales?: DepartmentDto[];

    itemSalesPeriod?: Period;
    itemsSales?: ItemDto[];

    dailySalesPeriod?: Period;
    dailySales?: DailySalesDto[];

    transactionsPeriod?: Period;
    transactions?: Transactions;
    selectedHeader?: TransactionHeaders;

    voidTransactionsPeriod?: Period;
    voidTransactions?: Transactions;
    voidSelectedHeader?: TransactionHeaders;

    refundTransactionsPeriod?: Period;
    refundTransactions?: Transactions;
    refundSelectedHeader?: TransactionHeaders;

    constructor() {
        const d = new Date(Date.now());
        const ds = this.getStartDateTime(d);
        const de = this.getEndDateTime(d);

        this.departmentSalesPeriod = new Period();
        this.departmentSalesPeriod.startDate = ds;
        this.departmentSalesPeriod.endDate = de;
        this.departmentSalesPeriod.periodName = 'Today';
        this.departmentSalesPeriod.chart = 'Bar Chart';
        this.departmentsSales = [];

        this.itemSalesPeriod = new Period();
        this.itemSalesPeriod.startDate = ds;
        this.itemSalesPeriod.endDate = de;
        this.itemSalesPeriod.periodName = 'Today';
        this.itemSalesPeriod.chart = 'Bar Chart';
        this.itemsSales = [];

        this.transactionsPeriod = new Period();
        this.transactionsPeriod.startDate = ds;
        this.transactionsPeriod.endDate = de;
        this.transactionsPeriod.periodName = 'Today';
        this.transactionsPeriod.pageNumber = 1;
        this.transactionsPeriod.linesPerPage = 10;

        this.voidTransactionsPeriod = new Period();
        this.voidTransactionsPeriod.startDate = ds;
        this.voidTransactionsPeriod.endDate = de;
        this.voidTransactionsPeriod.periodName = 'Today';
        this.voidTransactionsPeriod.pageNumber = 1;
        this.voidTransactionsPeriod.linesPerPage = 10;

        this.refundTransactionsPeriod = new Period();
        this.refundTransactionsPeriod.startDate = ds;
        this.refundTransactionsPeriod.endDate = de;
        this.refundTransactionsPeriod.periodName = 'Today';
        this.refundTransactionsPeriod.pageNumber = 1;
        this.refundTransactionsPeriod.linesPerPage = 10;

        const dd = new Date(Date.now());
        dd.setDate(dd.getDate() - 10);
        const dds = this.getStartDateTime(dd);

        dd.setDate(dd.getDate() + 9);
        const dde = this.getEndDateTime(dd);

        this.dailySalesPeriod = new Period();
        this.dailySalesPeriod.startDate = dds;
        this.dailySalesPeriod.endDate = dde;
        this.dailySalesPeriod.periodName = 'Last 10 Days';
        this.dailySalesPeriod.chart = 'Bar Chart';
        this.dailySales = [];
    }
    public reset() {
        this.departmentsSales.length = 0;
        this.departmentSalesPeriod.initiated = false;

        this.itemsSales.length = 0;
        this.itemSalesPeriod.initiated = false;

        this.dailySales.length = 0;
        this.dailySalesPeriod.initiated = false;

        this.transactions = null;
        this.transactionsPeriod.initiated = false;
        this.selectedHeader = null;

        this.voidTransactions = null;
        this.voidTransactionsPeriod.initiated = false;
        this.voidSelectedHeader = null;

        this.refundTransactions = null;
        this.refundTransactionsPeriod.initiated = false;
        this.refundSelectedHeader = null;
    }
    public getDateUkformat(d?: Date) {
        let month = (d.getMonth() + 1).toString();
        if ((d.getMonth() + 1) < 10 ) {
            month = '0' +  month;
        }
        let day = d.getDate().toString();
        if (d.getDate() < 10) {
            day = '0' + day;
        }
        let hour = d.getHours().toString();
        if (d.getHours() < 10) {
            hour = '0' + hour;
        }
        let minutes = d.getMinutes().toString();
        if (d.getMinutes() < 10) {
            minutes = '0' + minutes;
        }

        return  d.getFullYear().toString() + '-' + month + '-' + day + ' ' + hour + ':' + minutes;
    }
    private getStartDateTime(d?: Date): string {
        let month = (d.getMonth() + 1).toString();
        if ((d.getMonth() + 1) < 10 ) {
            month = '0' +  month;
        }
        let day = d.getDate().toString();
        if (d.getDate() < 10) {
            day = '0' + day;
        }
        return  d.getFullYear().toString() + '-' + month + '-' + day + 'T00:00';
    }
    private getEndDateTime(d?: Date): string {
        let month = (d.getMonth() + 1).toString();
        if ((d.getMonth() + 1) < 10 ) {
            month = '0' +  month;
        }
        let day = d.getDate().toString();
        if (d.getDate() < 10) {
            day = '0' + day;
        }
        return  d.getFullYear().toString() + '-' + month + '-' + day + 'T23:59';
    }

    getStartDateByTag(tag?: string): string {
        if (tag === 'Today') {
            const d = new Date(Date.now());
            return this.getStartDateTime(d);
        } else
        if (tag === 'Yesterday') {
            const d = new Date(Date.now());
            d.setDate(d.getDate() - 1);
            return this.getStartDateTime(d);
        } else
        if (tag === 'This Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day; // 0 for sunday
            const week_start_tstmp = curr_date.setDate(diff);
            const week_start = new Date(week_start_tstmp);
            return this.getStartDateTime(week_start);
        } else
        if (tag === 'Last Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day - 7; // 0 for sunday
            const last_week_start_tstmp = curr_date.setDate(diff);
            const last_week_start = new Date(last_week_start_tstmp);
            return  this.getStartDateTime(last_week_start);
        } else
        if (tag === 'This Month') {
            const curr_date = new Date();
            const month_start = new Date (curr_date.getFullYear(), curr_date.getMonth(), 1);
            return this.getStartDateTime(month_start);
        } else
        if (tag === 'Last Month') {
            const curr_date = new Date();
            const month_start = new Date (curr_date.getFullYear(), (curr_date.getMonth() - 1), 1);
            return this.getStartDateTime(month_start);
        } else
        if (tag === 'This Quarter') {
            const curr_date = new Date();
            const q = [1, 2, 3, 4];
            const curr_q = q[Math.floor((curr_date.getMonth()) / 3)];
            const q_start = new Date (curr_date.getFullYear(), ((curr_q - 1) * 3 ) , 1);
            return this.getStartDateTime(q_start);
        } else
        if (tag === 'Last Quarter') {
            const curr_date = new Date();
            const q = [1, 2, 3, 4];
            let curr_q = q[Math.floor((curr_date.getMonth()) / 3)];
            if ( curr_q === 1) {
                curr_q = 4;
                const q_start = new Date ((curr_date.getFullYear() - 1), ((curr_q - 1) * 3 ) , 1);
                return this.getStartDateTime(q_start);
            } else {
                curr_q = curr_q - 1;
                const q_start = new Date (curr_date.getFullYear(), ((curr_q - 1) * 3 ) , 1);
                return this.getStartDateTime(q_start);
            }
        } else
        if (tag === 'Last 10 Days') {
            const dd = new Date(Date.now());
            dd.setDate(dd.getDate() - 10);
            return this.getStartDateTime(dd);
        }
    }
    getEndDateByTag(tag?: string): string {
        if (tag === 'Today') {
            const d = new Date(Date.now());
            return this.getEndDateTime(d);
        } else
        if (tag === 'Yesterday') {
            const d = new Date(Date.now());
            d.setDate(d.getDate() - 1);
            return this.getEndDateTime(d);
        } else
        if (tag === 'This Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day; // 0 for sunday
            const week_start_tstmp = curr_date.setDate(diff);
            let week_end  = new Date(week_start_tstmp);
            week_end = new Date (week_end.setDate(week_end.getDate() + 6));
            return this.getEndDateTime(week_end);
        } else
        if (tag === 'Last Week') {
            const curr_date = new Date();
            const day = curr_date.getDay();
            const diff = curr_date.getDate() - day - 1; // 0 for sunday
            const last_week_end_tstmp = curr_date.setDate(diff);
            const last_week_end = new Date(last_week_end_tstmp);
            return  this.getEndDateTime(last_week_end);
        } else
        if (tag === 'This Month') {
            const curr_date = new Date();
            const month_end = new Date (curr_date.getFullYear(), (curr_date.getMonth() + 1), 0);
            return this.getEndDateTime(month_end);
        } else
        if (tag === 'Last Month') {
            const curr_date = new Date();
            const month_end = new Date (curr_date.getFullYear(), (curr_date.getMonth()), 0);
            return this.getEndDateTime(month_end);
        } else
        if (tag === 'This Quarter') {
            const curr_date = new Date();
            const q = [1, 2, 3, 4];
            const curr_q = q[Math.floor((curr_date.getMonth()) / 3)];
            const q_end = new Date (curr_date.getFullYear(), (curr_q) * 3 , 0);
            return this.getEndDateTime(q_end);
        } else
        if (tag === 'Last Quarter') {
            const curr_date = new Date();
            const q = [1, 2, 3, 4];
            let curr_q = q[Math.floor((curr_date.getMonth()) / 3)];
            if (curr_q === 1) {
                curr_q = 4;
                const q_end = new Date ((curr_date.getFullYear() - 1), (curr_q) * 3 , 0);
                return this.getEndDateTime(q_end);
            } else {
                curr_q = curr_q - 1;
                const q_end = new Date (curr_date.getFullYear(), (curr_q) * 3 , 0);
                return this.getEndDateTime(q_end);
            }
        } else
        if (tag === 'Last 10 Days') {
            const dd = new Date(Date.now());
            dd.setDate(dd.getDate() - 10);
            dd.setDate(dd.getDate() + 9);
            return this.getEndDateTime(dd);
        }
    }
}
