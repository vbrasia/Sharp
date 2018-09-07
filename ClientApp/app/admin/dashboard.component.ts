import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {DailySalesDto} from '../models/dailySalesDto.model';
import {DepartmentDto} from '../models/departmentDto.model';
import {ItemDto} from '../models/itemDto.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Period} from '../models/period.model';
import * as Chart from 'chart.js';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Operator/map';
import { Dashboard } from './dashboard';
const dailySalesUrl = 'api/daily';
const itemUrl = 'api/items';
const departmentUrl = 'api/departments';
@Component({
    templateUrl: 'dashboard.component.html'
    })
    export class DashboardComponent implements OnInit {
        DailyBarChartSales: any;
        DailyBarChartQty: any;
        DailyPieChartSales: any;
        DailyPieChartQty: any;

        DepartmentBarChartSales: any;
        DepartmentBarChartQty: any;
        DepartmentPieChartSales: any;
        DepartmentPieChartQty: any;

        ItemBarChartSales: any;
        ItemBarChartQty: any;
        ItemPieChartSales: any;
        ItemPieChartQty: any;

        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private localStorage: LocalStorage, private dashboard: Dashboard, private router: Router) {
            if (!repo.selecttedStore) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                if (!this.dashboard.dashboardPeriod.initiated) {
                    this.getPeriod().subscribe(response => {
                        if (response) {
                            this.dashboard.dashboardPeriod = response;
                            this.dashboard.dashboardPeriod.initiated = false;
                        }
                        if (( this.dashboard.dashboardPeriod.startDate) && ( this.dashboard.dashboardPeriod.endDate)) {
                            this.startDate = this.dashboard.dashboardPeriod.startDate;
                            this.endDate = this.dashboard.dashboardPeriod.endDate;
                            this.dashboard.dashboardPeriod.initiated = true;
                            this.getSales();
                        }
                    });
                }
            }
        }
        get screenWidth(): number {
            return this.repo.screenWidth;
        }
        get period(): string {
            return this.dashboard.dashboardPeriod.periodName;
        }
        setChart(tag?: string) {
            this.dashboard.dashboardPeriod.chart = tag;
            this.savePeriod(this.dashboard.dashboardPeriod);
        }
        get chart(): string {
            return this.dashboard.dashboardPeriod.chart;
        }
        isBarchart() {
            if (this.dashboard.dashboardPeriod.chart === 'Bar Chart') {
                return true;
            } else {
                return false;
            }
        }
        isPieChart() {
            if (this.dashboard.dashboardPeriod.chart === 'Pie Chart') {
                return true;
            } else {
                return false;
            }
        }
        ngOnInit() {
            if (( this.dashboard.dashboardPeriod.startDate) && ( this.dashboard.dashboardPeriod.startDate)) {
                this.startDate = this.dashboard.dashboardPeriod.startDate;
                this.endDate = this.dashboard.dashboardPeriod.endDate;
                this.getItemCharts();
                this.getDepartmentCharts();
                this.getDailySalesCharts();
            }
        }
        savePeriod(period: Period) {
            this.getPeriod().subscribe(response => {
                if (response) {
                    if (response !== period) {
                        this.localStorage.setItem('dashboard', period).subscribe(() => {});
                    }
                } else {
                    this.localStorage.setItem('dashboard', period).subscribe(() => {});
                }
            });
        }
        getPeriod(): Observable<Period> {
            return this.localStorage.getItem<Period>('dashboard');
        }
        get dailySales(): DailySalesDto[] {
            return this.dashboard.dailySales;
        }
        get departmentSales(): DepartmentDto[] {
            return this.dashboard.departmentsSales.sort((a , b) => {
                const amtDiff =  b.amount - a.amount;
                if ( amtDiff ) {return amtDiff; }
            });
        }
        get departmentQty(): DepartmentDto[] {
            return this.dashboard.departmentsSales.sort((a , b) => {
                const amtDiff =  b.qty - a.qty;
                if ( amtDiff ) {return amtDiff; }
            });
        }
        gettop20ItemSales(): ItemDto[] {
            if (this.dashboard.itemsSales.length < 2) {
                return this.dashboard.itemsSales;
            } else
            if (this.dashboard.itemsSales.length <= 20) {
                return this.dashboard.itemsSales.sort((a , b) => {
                    const amtDiff =  b.amount - a.amount;
                    if ( amtDiff ) {return amtDiff; }
                });
            } else {
                return this.dashboard.itemsSales.sort((a , b) => {
                    const amtDiff =  b.amount - a.amount;
                    if ( amtDiff ) {return amtDiff; }
                }).slice(0, 20);
            }
        }
        gettop20ItemQty(): ItemDto[] {
            if (this.dashboard.itemsSales.length < 2) {
                return this.dashboard.itemsSales;
            } else
            if (this.dashboard.itemsSales.length <= 20) {
                return this.dashboard.itemsSales.sort((a , b) => {
                    const amtDiff =  b.quantity - a.quantity;
                    if ( amtDiff ) {return amtDiff; }
                });
            } else {
                return this.dashboard.itemsSales.sort((a , b) => {
                    const amtDiff =  b.quantity - a.quantity;
                    if ( amtDiff ) {return amtDiff; }
                }).slice(0, 20);
            }
        }
        getItemBarChartSales() {
            this.ItemBarChartSales = new Chart('itemBarChartSales', {
                type: 'bar',
                data: {
                    labels: this.gettop20ItemSales().map(x => x.description),
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.gettop20ItemSales().map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Top 20 Product\'s Sales',
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                offsetGridLines: true
                            },
                            ticks: {
                              minRotation: 90
                            }
                          }]
                    }
                }
            });
        }
        getItemPieChartSales() {
            this.ItemPieChartSales = new Chart('itemPieChartSales', {
                type: 'pie',
                data: {
                    labels: this.gettop20ItemSales().map(x => x.description),
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.gettop20ItemSales().map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Top 20 Product\'s Sales',
                        display: true
                    }
                }
            });
        }
        getItemBarChartQty() {
            this.ItemBarChartQty = new Chart('itemBarChartQty', {
                type: 'bar',
                data: {
                    labels: this.gettop20ItemQty().map(x => x.description),
                    datasets: [ {
                        label: 'Sales Qty',
                        data:  this.gettop20ItemQty().map(x => x.quantity),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Top 20 Product\'s Qty',
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                offsetGridLines: true
                            },
                            ticks: {
                              minRotation: 90
                            }
                          }]
                    }
                }
            });
        }
        getItemPieChartQty() {
            this.ItemPieChartQty = new Chart('itemPieChartQty', {
                type: 'pie',
                data: {
                    labels: this.gettop20ItemQty().map(x => x.description),
                    datasets: [ {
                        label: 'Sales Qty',
                        data:  this.gettop20ItemQty().map(x => x.quantity),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Top 20 Product\'s Qty',
                        display: true
                    }
                }
            });
        }
        private removeData(chart) {
            chart.data.labels.length = 0;
            chart.data.datasets.forEach((dataset) => {
            dataset.data.length = 0;
            });
            chart.update();
        }
        private addData(chart, labels, datas) {
            labels.forEach(element => {
                chart.data.labels.push(element);
            });
            chart.data.datasets.forEach((dataset) => {
                datas.forEach(element => {
                    dataset.data.push(element);
                });
            });
            chart.update();
        }
        private getItemCharts() {
            if (!this.ItemBarChartSales) {
                this.getItemBarChartSales();
            } else {
                this.removeData(this.ItemBarChartSales);
                this.addData(this.ItemBarChartSales, this.gettop20ItemSales().map(x => x.description),
                this.gettop20ItemSales().map(x => x.amount));
            }
            if (!this.ItemPieChartSales) {
                this.getItemPieChartSales();
            } else {
                this.removeData(this.ItemPieChartSales);
                this.addData(this.ItemPieChartSales, this.gettop20ItemSales().map(x => x.description),
                this.gettop20ItemSales().map(x => x.amount));
            }
            if (!this.ItemBarChartQty) {
                this.getItemBarChartQty();
            } else {
                this.removeData(this.ItemBarChartQty);
                this.addData(this.ItemBarChartQty, this.gettop20ItemQty().map(x => x.description),
                this.gettop20ItemQty().map(x => x.quantity));
            }
            if (!this.ItemPieChartQty) {
                this.getItemPieChartQty();
            } else {
                this.removeData(this.ItemPieChartQty);
                this.addData(this.ItemPieChartQty, this.gettop20ItemQty().map(x => x.description),
                this.gettop20ItemQty().map(x => x.quantity));
            }
        }
        getSales() {
            let url = dailySalesUrl + '/sales';
            this.repo.storeDto.startDate = this.startDate;
            this.repo.storeDto.endDate = this.endDate;
            if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
                this.dashboard.dashboardPeriod.startDate = this.startDate;
                this.dashboard.dashboardPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.savePeriod(this.dashboard.dashboardPeriod);
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response1 => {
                    this.dashboard.dailySales = response1;
                    this.getDailySalesCharts();
                    url = departmentUrl + '/sales';
                    this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response2 => {
                        this.dashboard.departmentsSales = response2;
                        this.getDepartmentCharts();
                        url = itemUrl + '/sales';
                        this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response3 => {
                            this.dashboard.itemsSales = response3;
                            this.getItemCharts();
                            this.repo.apiBusy = false;
                        });
                    });
                });
            }
        }
        getDepartmentBarChartSales() {
            this.DepartmentBarChartSales = new Chart('departmentBarChartSales', {
                type: 'bar',
                data: {
                    labels: this.departmentSales.map(x => x.department),
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.departmentSales.map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Department Sales',
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                offsetGridLines: true
                            },
                            ticks: {
                              minRotation: 90
                            }
                          }]
                    }
                }
            });
        }
        getDepartmentPieChartSales() {
            this.DepartmentPieChartSales = new Chart('departmentPieChartSales', {
                type: 'pie',
                data: {
                    labels: this.departmentSales.map(x => x.department),
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.departmentSales.map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Department Sales',
                        display: true
                    }
                }
            });
        }
        getDepartmentBarChartQty() {
            this.DepartmentBarChartQty = new Chart('departmentBarChartQty', {
                type: 'bar',
                data: {
                    labels: this.departmentQty.map(x => x.department),
                    datasets: [ {
                        label: 'Sales Qty',
                        data:  this.departmentQty.map(x => x.qty),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Department Qty',
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                offsetGridLines: true
                            },
                            ticks: {
                              minRotation: 90
                            }
                          }]
                    }
                }
            });
        }
        getDepartmentPieChartQty() {
            this.DepartmentPieChartQty = new Chart('departmentPieChartQty', {
                type: 'pie',
                data: {
                    labels: this.departmentQty.map(x => x.department),
                    datasets: [ {
                        label: 'Sales Qty',
                        data:  this.departmentQty.map(x => x.qty),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Department Qty',
                        display: true
                    }
                }
            });
        }
        private getDepartmentCharts() {
            if (!this.DepartmentBarChartSales) {
                this.getDepartmentBarChartSales();
            } else {
                this.removeData(this.DepartmentBarChartSales);
                this.addData(this.DepartmentBarChartSales, this.departmentSales.map(x => x.department),
                this.departmentSales.map(x => x.amount));
            }
            if (!this.DepartmentPieChartSales) {
                this.getDepartmentPieChartSales();
            } else {
                this.removeData(this.DepartmentPieChartSales);
                this.addData(this.DepartmentPieChartSales, this.departmentSales.map(x => x.department),
                this.departmentSales.map(x => x.amount));
            }
            if (!this.DepartmentBarChartQty) {
                this.getDepartmentBarChartQty();
            } else {
                this.removeData(this.DepartmentBarChartQty);
                this.addData(this.DepartmentBarChartQty, this.departmentQty.map(x => x.department),
                this.departmentQty.map(x => x.qty));
            }
            if (!this.DepartmentPieChartQty) {
                this.getDepartmentPieChartQty();
            } else {
                this.removeData(this.DepartmentPieChartQty);
                this.addData(this.DepartmentPieChartQty, this.departmentQty.map(x => x.department),
                this.departmentQty.map(x => x.qty));
            }
        }
        get chartLabels() {
            const label = [];
            this.dailySales.forEach(element => {
                label.push(element.dayDate + ' : ' + element.dayName);
            });
            return label;
        }
        getDailyBarChartSales() {
            this.DailyBarChartSales = new Chart('dailyBarChartSales', {
                type: 'bar',
                data: {
                    labels: this.chartLabels,
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.dailySales.map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Daily Sales',
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                offsetGridLines: true
                            },
                            ticks: {
                              minRotation: 90
                            }
                          }]
                    }
                }
            });
        }
        getDailyPieChartSales() {
            this.DailyPieChartSales = new Chart('dailyPieChartSales', {
                type: 'pie',
                data: {
                    labels: this.chartLabels,
                    datasets: [ {
                        label: 'Sales Amount',
                        data:  this.dailySales.map(x => x.amount),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Daily Sales',
                        display: true
                    }
                }
            });
        }
        getDailyBarChartQty() {
            this.DailyBarChartQty = new Chart('dailyBarChartQty', {
                type: 'bar',
                data: {
                    labels: this.chartLabels,
                    datasets: [ {
                        label: 'No of Transactions',
                        data:  this.dailySales.map(x => x.trans),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Daily Transactions',
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                offsetGridLines: true
                            },
                            ticks: {
                              minRotation: 90
                            }
                          }]
                    }
                }
            });
        }
        getDailyPieChartQty() {
            this.DailyPieChartQty = new Chart('dailyPieChartQty', {
                type: 'pie',
                data: {
                    labels: this.chartLabels,
                    datasets: [ {
                        label: 'No of Transactions',
                        data:  this.dailySales.map(x => x.trans),
                        backgroundColor: this.repo.chartBackgroundColor,
                        borderColor: this.repo.chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options : {
                    maintainAspectRatio: false,
                    title: {
                        text: 'Daily Transactions',
                        display: true
                    }
                }
            });
        }
        private getDailySalesCharts() {
                    if (!this.DailyBarChartSales) {
                        this.getDailyBarChartSales();
                    } else {
                        this.removeData(this.DailyBarChartSales);
                        this.addData(this.DailyBarChartSales, this.chartLabels,
                        this.dailySales.map(x => x.amount));
                    }
                    if (!this.DailyPieChartSales) {
                        this.getDailyPieChartSales();
                    } else {
                        this.removeData(this.DailyPieChartSales);
                        this.addData(this.DailyPieChartSales, this.chartLabels,
                        this.dailySales.map(x => x.amount));
                    }
                    if (!this.DailyBarChartQty) {
                        this.getDailyBarChartQty();
                    } else {
                        this.removeData(this.DailyBarChartQty);
                        this.addData(this.DailyBarChartQty, this.chartLabels,
                        this.dailySales.map(x => x.trans));
                    }
                    if (!this.DailyPieChartQty) {
                        this.getDailyPieChartQty();
                    } else {
                        this.removeData(this.DailyPieChartQty);
                        this.addData(this.DailyPieChartQty, this.chartLabels,
                        this.dailySales.map(x => x.trans));
                    }
        }
        setPeriod(tag?: string) {
            if (tag !== this.dashboard.dashboardPeriod.periodName) {
                this.dashboard.dashboardPeriod.periodName = tag;
                if (tag !== '') {
                    this.startDate = this.dashboard.getStartDateByTag(tag);
                    this.endDate = this.dashboard.getEndDateByTag(tag);
                }
                this.dashboard.dashboardPeriod.startDate = this.startDate;
                this.dashboard.dashboardPeriod.endDate = this.endDate;
                if (tag !== '') {
                    this.getSales();
                }
            }
        }
    }
