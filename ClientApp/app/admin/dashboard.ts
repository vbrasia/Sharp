import { Injectable } from '@angular/core';
import {DepartmentDto} from '../models/departmentDto.model';
import {ItemDto} from '../models/itemDto.model';
import {Period} from '../models/period.model';
import { DailySalesDto } from '../models/dailySalesDto.model';
@Injectable()
export class Dashboard {
    dashboardPeriod?: Period;
    departmentsSales?: DepartmentDto[];
    itemsSales?: ItemDto[];
    dailySales?: DailySalesDto[];
    constructor() {
        this.dashboardPeriod = new Period();
        this.dashboardPeriod.startDate = this.getStartDateByTag('Last Week');
        this.dashboardPeriod.endDate = this.getEndDateByTag('Last Week');
        this.dashboardPeriod.periodName = 'Last Week';
        this.dashboardPeriod.chart = 'Bar Chart';

        this.itemsSales = [];
        this.departmentsSales = [];
        this.dailySales = [];
    }
    reset() {
        this.itemsSales.length = 0;
        this.departmentsSales.length = 0;
        this.dailySales.length = 0;
        this.dashboardPeriod.initiated = false;
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
