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
import { ServerDto } from '../models/serverDto.model';
const dailySalesUrl = 'api/daily';
const itemUrl = 'api/items';
const departmentUrl = 'api/departments';
@Component({
    templateUrl: 'dashboard.component.html'
    })
    export class DashboardComponent implements OnInit {

        srvNos?: number[];
        srvs?: ServerDto[];
        tillNos?: number[];
        groupedDaily?: DailySalesDto[];
        groupedItem?: ItemDto[];
        groupedDepartment?: DepartmentDto[];

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
                this.groupedDaily = new Array();
                this.groupedItem = new Array();
                this.groupedDepartment = new Array();
                this.srvs = new Array();
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
        ngOnInit() {
            if (( this.dashboard.dashboardPeriod.startDate) && ( this.dashboard.dashboardPeriod.startDate)) {
                this.startDate = this.dashboard.dashboardPeriod.startDate;
                this.endDate = this.dashboard.dashboardPeriod.endDate;
                this.getGroupByItem();
                this.getItemCharts();
                this.getGroupByDepartment();
                this.getDepartmentCharts();
                this.getGroupByDate();
                this.getDailySalesCharts();
                this.getSrvNos();
                this.getTillNos();
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
        //#region getSrvNos
        getSrvNos() {
            this.srvNos = this.dashboard.itemsSales.map(u => u.srvNo).filter( (value, index, self) => {
                return self.indexOf(value) === index;
            } ).sort((a, b ) => {
                const diff = a - b;
                if (diff) {return diff; }
            });
            this.srvs.length = 0;
                if (this.repo.servers) {
                    this.repo.servers.forEach(element => {
                        const id = element.srvNo;
                        if (this.srvNos.indexOf(id) > -1) {
                            this.srvs.push(element);
                        }
                    });
                }
        }
        //#endregion getSrvNos
        //#region  getTillNos
        getTillNos() {
            this.tillNos = this.dashboard.itemsSales.map(u => u.tillNo).filter( (value, index, self) => {
                return self.indexOf(value) === index;
            } ).sort((a, b) => {
                const diff = a - b;
                if (diff) { return diff ; }
            });
        }
        //#endregion getTillNos
        set chosenSrvNo(filterVal: string) {
            if (this.dashboard.dashboardPeriod.svrNo !== filterVal) {
                this.dashboard.dashboardPeriod.svrNo = filterVal;
                this.getGroupByItem();
                this.getItemCharts();
                this.getGroupByDepartment();
                this.getDepartmentCharts();
                this.getGroupByDate();
                this.getDailySalesCharts();
            }
            this.savePeriod(this.dashboard.dashboardPeriod);
        }
        get chosenSrvNo(): string {
            return this.dashboard.dashboardPeriod.svrNo;
        }
        set chosenTillNo(filterVal: string) {
            if (this.dashboard.dashboardPeriod.tillNo !== filterVal) {
                this.dashboard.dashboardPeriod.tillNo = filterVal;
                this.getGroupByItem();
                this.getItemCharts();
                this.getGroupByDepartment();
                this.getDepartmentCharts();
                this.getGroupByDate();
                this.getDailySalesCharts();
            }
            this.savePeriod(this.dashboard.dashboardPeriod);
        }
        get chosenTillNo(): string {
            return this.dashboard.dashboardPeriod.tillNo;
        }
        //#region Department
        //#region Filter Department
        get filteredDepartmentSales():  DepartmentDto[] {
            if (this.dashboard.departmentsSales) {
                const srvNo = Number(this.chosenSrvNo);
                const till = Number(this.chosenTillNo);
                if (srvNo === 0 && till === 0) {
                    return this.dashboard.departmentsSales;
                } else if (srvNo === 0 && till !== 0) {
                return this.dashboard.departmentsSales.filter(x => (x.till === till));
                } else if (srvNo !== 0 && till === 0) {
                    return this.dashboard.departmentsSales.filter(x => (x.srvNo === srvNo));
                } else {
                    return this.dashboard.departmentsSales.filter(x => (x.srvNo === srvNo && x.till === till));
                }
            }
        }
        //#endregion Filter Department
        //#region Group by Department
        getGroupByDepartment() {
            if (this.filteredDepartmentSales) {
                this.groupedDepartment.length = 0;
                this.filteredDepartmentSales.forEach(element => {
                    const deptno = element.id;
                    const filterGrouped = this.groupedDepartment.filter(x => x.id === deptno);
                    if (filterGrouped.length > 0) {
                        const ele = this.groupedDepartment.filter(x => x.id === deptno)[0];
                        const index = this.groupedDepartment.indexOf(ele);
                        this.groupedDepartment[index].amount = this.groupedDepartment[index].amount +  element.amount;
                        this.groupedDepartment[index].qty =  this.groupedDepartment[index].qty +  element.qty;
                    } else {
                        this.groupedDepartment.push(element);
                    }
                });
            }
        }
        //#endregion  Group by Department
        //#region departmentSales
        get departmentSales(): DepartmentDto[] {
            return this.groupedDepartment.sort((a , b) => {
                const amtDiff =  b.amount - a.amount;
                if ( amtDiff ) {return amtDiff; }
            });
        }
        //#endregion departmentSales
        //#region departmentQty
        get departmentQty(): DepartmentDto[] {
            return this.groupedDepartment.sort((a , b) => {
                const amtDiff =  b.qty - a.qty;
                if ( amtDiff ) {return amtDiff; }
            });
        }
        //#endregion departmentQty
        //#region Department Charts
        //#region DepartmentBarChartSales
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
        //#endregion DepartmentBarChartSales
        //#region DepartmentPieChartSales
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
        //#endregion DepartmentPieChartSales
        //#region DepartmentBarChartQty
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
        //#endregion DepartmentBarChartQty
        //#region DepartmentPieChartQty
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
        //#endregion DepartmentPieChartQty
        //#region getDepartmentCharts
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
        //#endregion getDepartmentCharts
        //#endregion Department Charts
        //#endregion Departments

        //#region Items
        //#region filteredItemSales
        get filteredItemSales():  ItemDto[] {
            if (this.dashboard.itemsSales) {
                const srvNo = Number(this.chosenSrvNo);
                const till = Number(this.chosenTillNo);
                if (srvNo === 0 && till === 0) {
                    return this.dashboard.itemsSales;
                } else if (srvNo === 0 && till !== 0) {
                return this.dashboard.itemsSales.filter(x => (x.tillNo === till));
                } else if (srvNo !== 0 && till === 0) {
                    return this.dashboard.itemsSales.filter(x => (x.srvNo === srvNo));
                } else {
                    return this.dashboard.itemsSales.filter(x => (x.srvNo === srvNo && x.tillNo === till));
                }
            }
        }
        //#endregion filteredItemSales
        //#region getGroupByItem
        getGroupByItem() {
            if (this.filteredItemSales) {
                this.groupedItem.length = 0;
                this.filteredItemSales.forEach(element => {
                    const item = element.description;
                    const filterGrouped = this.groupedItem.filter(x => x.description === item);
                    if (filterGrouped.length > 0) {
                        const ele = this.groupedItem.filter(x => x.description === item)[0];
                        const index = this.groupedItem.indexOf(ele);
                        this.groupedItem[index].amount = this.groupedItem[index].amount +  element.amount;
                        this.groupedItem[index].quantity =  this.groupedItem[index].quantity +  element.quantity;
                    } else {
                        this.groupedItem.push(element);
                    }
                });
            }
        }
        //#endregion getGroupByItem
        //#region gettop20ItemSales
        gettop20ItemSales(): ItemDto[] {
            if (this.groupedItem.length < 2) {
                return this.groupedItem;
            } else
            if (this.groupedItem.length <= 20) {
                return this.groupedItem.sort((a , b) => {
                    const amtDiff =  b.amount - a.amount;
                    if ( amtDiff ) {return amtDiff; }
                });
            } else {
                return this.groupedItem.sort((a , b) => {
                    const amtDiff =  b.amount - a.amount;
                    if ( amtDiff ) {return amtDiff; }
                }).slice(0, 20);
            }
        }
        //#endregion gettop20ItemSales
        //#region gettop20ItemQty
        gettop20ItemQty(): ItemDto[] {
            if (this.groupedItem.length < 2) {
                return this.groupedItem;
            } else
            if (this.groupedItem.length <= 20) {
                return this.groupedItem.sort((a , b) => {
                    const amtDiff =  b.quantity - a.quantity;
                    if ( amtDiff ) {return amtDiff; }
                });
            } else {
                return this.groupedItem.sort((a , b) => {
                    const amtDiff =  b.quantity - a.quantity;
                    if ( amtDiff ) {return amtDiff; }
                }).slice(0, 20);
            }
        }
        //#endregion gettop20ItemQty
        //#region getItemBarChartSales
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
        //#endregion getItemBarChartSales
        //#region getItemPieChartSales
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
        //#endregion getItemPieChartSales
        //#region getItemBarChartQty
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
        //#endregion getItemBarChartQty
        //#region getItemPieChartQty
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
        //#endregion getItemPieChartQty
        //#region getItemCharts
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
        //#endregion getItemCharts
        //#endregion Items

        //#region Daily sales
        //#region filteredDailySales
        get filteredDailySales():  DailySalesDto[] {
            if (this.dashboard.dailySales) {
                const srvNo = Number(this.chosenSrvNo);
                const till = Number(this.chosenTillNo);
                if (srvNo === 0 && till === 0) {
                    return this.dashboard.dailySales;
                } else if (srvNo === 0 && till !== 0) {
                return this.dashboard.dailySales.filter(x => (x.tillNo === till));
                } else if (srvNo !== 0 && till === 0) {
                    return this.dashboard.dailySales.filter(x => (x.srvNo === srvNo));
                } else {
                    return this.dashboard.dailySales.filter(x => (x.srvNo === srvNo && x.tillNo === till));
                }
            }
        }
        //#endregion filteredDailySales
        //#region getGroupByDate
        getGroupByDate() {
            if (this.filteredDailySales) {
                this.groupedDaily.length = 0;
                this.filteredDailySales.forEach(element => {
                    const dayDate = element.dayDate;
                    const filterGrouped = this.groupedDaily.filter(x => x.dayDate === dayDate);
                    if (filterGrouped.length > 0) {
                        const ele = this.groupedDaily.filter(x => x.dayDate === dayDate)[0];
                        const index = this.groupedDaily.indexOf(ele);
                        this.groupedDaily[index].amount = this.groupedDaily[index].amount +  element.amount;
                        this.groupedDaily[index].trans =  this.groupedDaily[index].trans +  element.trans;
                    } else {
                        this.groupedDaily.push(element);
                    }
                });
            }
        }
        //#endregion getGroupByDate
        //#region dailySales
        get dailySales(): DailySalesDto[] {
            return this.groupedDaily;
        }
        //#endregion dailySales
        //#region getDailyBarChartSales
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
        //#endregion getDailyBarChartSales
        //#region getDailyPieChartSales
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
        //#endregion getDailyPieChartSales
        //#region getDailyBarChartQty
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
        //#endregion getDailyBarChartQty
        //#region getDailyPieChartQty
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
        //#endregion getDailyPieChartQty
        //#region getDailySalesCharts
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
        //#endregion getDailySalesCharts
        //#endregion Daily sales

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
                    this.getGroupByDate();
                    this.getDailySalesCharts();
                    url = departmentUrl + '/sales';
                    this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response2 => {
                        this.dashboard.departmentsSales = response2;
                        this.getGroupByDepartment();
                        this.getDepartmentCharts();
                        url = itemUrl + '/sales';
                        this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response3 => {
                            this.dashboard.itemsSales = response3;
                            this.getGroupByItem();
                            this.getItemCharts();
                            this.getSrvNos();
                            this.getTillNos();
                            this.repo.apiBusy = false;
                        });
                    });
                });
            }
        }
        get chartLabels() {
            const label = [];
            this.dailySales.forEach(element => {
                label.push(element.dayDate + ' : ' + element.dayName);
            });
            return label;
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
