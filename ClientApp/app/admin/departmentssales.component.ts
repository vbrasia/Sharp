import { Component, OnInit} from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {DepartmentDto} from '../models/departmentDto.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import {Period} from '../models/period.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Operator/map';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Report } from './report';
import { ServerDto } from '../models/serverDto.model';
const departmentUrl = 'api/departments';
@Component({
    templateUrl: 'departmentsSales.component.html'
    })
    export class DepartmentsSalesComponent implements OnInit {
        BarChart: any;
        PieChart: any;
        startDate?: string;
        endDate?: string;
        srvNos?: number[];
        srvs?: ServerDto[];
        tillNos?: number[];
        grouped?: DepartmentDto[];
        constructor(private repo: Repository, private localStorage: LocalStorage, private report: Report, private router: Router) {
            if (!repo.selecttedStore) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                this.grouped = new Array();
                this.srvs = new Array();
                if (!this.report.departmentSalesPeriod.initiated) {
                    this.getPeriod().subscribe(response => {
                        if (response) {
                            this.report.departmentSalesPeriod = response;
                            this.report.departmentSalesPeriod.initiated = false;
                        }
                        if (( this.report.departmentSalesPeriod.startDate) && ( this.report.departmentSalesPeriod.endDate)) {
                                this.startDate = this.report.departmentSalesPeriod.startDate;
                                this.endDate = this.report.departmentSalesPeriod.endDate;
                                this.report.departmentSalesPeriod.initiated = true;
                                this.getDepartmentSales();
                        }
                    });
                }
            }
        }
        ngOnInit() {
            if (( this.report.departmentSalesPeriod.startDate) && ( this.report.departmentSalesPeriod.endDate)) {
                this.startDate = this.report.departmentSalesPeriod.startDate;
                this.endDate = this.report.departmentSalesPeriod.endDate;
                this.getSrvNos();
                this.getTillNos();
                this.getGroupByDepartment();
                this.getCharts();
            }
        }
        get orderBy(): string {
             return this.report.departmentSalesPeriod.orderBy;
        }
        get isAsc(): boolean {
            return this.report.departmentSalesPeriod.isAsc;
        }
        get screenWidth(): number {
            return this.repo.screenWidth;
        }

        //#region charts
        //#region getCharts
        private getCharts() {
            if (!this.BarChart) {
                this.getBarChart();
            } else {
                this.removeData(this.BarChart);
                this.addData(this.BarChart, this.departmentSales.map(x => x.department),
                this.departmentSales.map(x => x.amount));
            }
            if (!this.PieChart) {
                this.getPieChart();
            } else {
                this.removeData(this.PieChart);
                this.addData(this.PieChart, this.departmentSales.map(x => x.department),
                this.departmentSales.map(x => x.amount));
            }
        }
        //#endregion getCharts
        //#region getBarChart
        getBarChart() {
            this.BarChart = new Chart('barChart', {
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
        //#endregion getBarChart
        //#region getPieChart
        getPieChart() {
            this.PieChart = new Chart('pieChart', {
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
        //#endregion getPieChart

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
        //#endregion charts
        getDepartmentSales() {
            const url = departmentUrl + '/sales';
            this.repo.storeDto.startDate = this.startDate;
            this.repo.storeDto.endDate = this.endDate;

            if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
                this.report.departmentSalesPeriod.startDate = this.startDate;
                this.report.departmentSalesPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.savePeriod(this.report.departmentSalesPeriod);
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.report.departmentsSales = response;
                    this.getSrvNos();
                    this.getTillNos();
                    this.getGroupByDepartment();
                    this.getCharts();
                    this.repo.apiBusy = false;
                });
            }
        }
        getTotalAmount(): number {
            if ((this.departmentSales) && (this.departmentSales.length > 0)) {
                return this.departmentSales.map(x => x.amount).reduce((s, u) => s + u + 0);
            } else {
                return 0;
            }
        }
        getTotalQty(): number {
            if ((this.departmentSales) && (this.departmentSales.length > 0)) {
                return this.departmentSales.map(x => x.qty).reduce((s, u) => s + u + 0);
            } else {
                return 0;
            }
        }
        getSrvNos() {
            this.srvNos = this.report.departmentsSales.map(u => u.srvNo).filter( (value, index, self) => {
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
        getTillNos() {
            this.tillNos = this.report.departmentsSales.map(u => u.till).filter( (value, index, self) => {
                return self.indexOf(value) === index;
            } ).sort((a, b) => {
                const diff = a - b;
                if (diff) { return diff ; }
            });
        }
        set chosenSrvNo(filterVal: string) {
            if (this.report.departmentSalesPeriod.svrNo !== filterVal) {
                this.report.departmentSalesPeriod.svrNo = filterVal;
                this.getGroupByDepartment();
                this.getCharts();
            }
            this.savePeriod(this.report.departmentSalesPeriod);
        }
        get chosenSrvNo(): string {
            return this.report.departmentSalesPeriod.svrNo;
        }

        set chosenTillNo(filterVal: string) {
            if (this.report.departmentSalesPeriod.tillNo !== filterVal) {
                this.report.departmentSalesPeriod.tillNo = filterVal;
                this.getGroupByDepartment();
                this.getCharts();
            }
            this.savePeriod(this.report.departmentSalesPeriod);
        }
        get chosenTillNo(): string {
            return this.report.departmentSalesPeriod.tillNo;
        }
        //#region departmentSales
        get filteredDepartmentSales():  DepartmentDto[] {
            if (this.report.departmentsSales) {
                const srvNo = Number(this.chosenSrvNo);
                const till = Number(this.chosenTillNo);
                if (srvNo === 0 && till === 0) {
                    return this.report.departmentsSales;
                } else if (srvNo === 0 && till !== 0) {
                return this.report.departmentsSales.filter(x => (x.till === till));
                } else if (srvNo !== 0 && till === 0) {
                    return this.report.departmentsSales.filter(x => (x.srvNo === srvNo));
                } else {
                    return this.report.departmentsSales.filter(x => (x.srvNo === srvNo && x.till === till));
                }
            }
        }
        getGroupByDepartment() {
            if (this.filteredDepartmentSales) {
                this.grouped.length = 0;
                this.filteredDepartmentSales.forEach(element => {
                    const deptno = element.id;
                    const filterGrouped = this.grouped.filter(x => x.id === deptno);
                    if (filterGrouped.length > 0) {
                        const ele = this.grouped.filter(x => x.id === deptno)[0];
                        const index = this.grouped.indexOf(ele);
                        this.grouped[index].amount = this.grouped[index].amount +  element.amount;
                        this.grouped[index].qty =  this.grouped[index].qty +  element.qty;
                    } else {
                        this.grouped.push(element);
                    }
                });
            }
        }
        get departmentSales(): DepartmentDto[] {
            if (this.grouped) {
                if (this.orderBy === 'department') {
                    if (this.isAsc) {
                        return this.grouped.sort((a , b) => {
                            return a.department.localeCompare(b.department);
                        });
                    } else {
                        return this.grouped.sort((a , b) => {
                            return b.department.localeCompare(a.department);
                        });
                    }
                } else if (this.orderBy === 'qty') {
                    if (this.isAsc) {
                        return this.grouped.sort((a , b) => {
                            const qtyDiff =  a.qty - b.qty;
                            if ( qtyDiff ) {return qtyDiff; }
                        });
                    } else {
                        return this.grouped.sort((a , b) => {
                            const qtyDiff =  b.qty - a.qty;
                            if ( qtyDiff ) {return qtyDiff; }
                        });
                    }
                } else if ((this.orderBy === 'amount')) {
                    if (this.isAsc) {
                        return this.grouped.sort((a , b) => {
                            const amtDiff =  a.amount - b.amount;
                            if ( amtDiff ) {return amtDiff; }
                        });
                    } else {
                        return this.grouped.sort((a , b) => {
                            const amtDiff =  b.amount - a.amount;
                            if ( amtDiff ) {return amtDiff; }
                        });
                    }
                }
            }
        }
        //#endregion departmentSales
        setPeriod(tag?: string) {
            if (tag !== this.report.departmentSalesPeriod.periodName) {
                this.report.departmentSalesPeriod.periodName = tag;
                if (tag !== '') {
                    this.startDate = this.report.getStartDateByTag(tag);
                    this.endDate = this.report.getEndDateByTag(tag);
                }
                this.report.departmentSalesPeriod.startDate = this.startDate;
                this.report.departmentSalesPeriod.endDate = this.endDate;
                if (tag !== '') {
                    this.getDepartmentSales();
                }
            }
        }
        get period(): string {
            return this.report.departmentSalesPeriod.periodName;
        }
        orderByHeader(header?: string) {
            if (this.report.departmentSalesPeriod.orderBy !== header) {
                this.report.departmentSalesPeriod.orderBy = header;
                this.report.departmentSalesPeriod.isAsc = false;
            } else {
                this.report.departmentSalesPeriod.isAsc = !this.report.departmentSalesPeriod.isAsc;
            }
            this.savePeriod(this.report.departmentSalesPeriod);
            this.getCharts();
        }

        setChart(tag?: string) {
            this.report.departmentSalesPeriod.chart = tag;
            this.savePeriod(this.report.departmentSalesPeriod);
        }
        get chart(): string {
            return this.report.departmentSalesPeriod.chart;
        }
        savePeriod(period: Period) {
            this.getPeriod().subscribe(response => {
                if (response) {
                    if (response !== period) {
                        this.localStorage.setItem('departmentSales', period).subscribe(() => {});
                    }
                } else {
                    this.localStorage.setItem('departmentSales', period).subscribe(() => {});
                }
            });
        }
        getPeriod(): Observable<Period> {
            return this.localStorage.getItem<Period>('departmentSales');
        }
        isBarchart() {
            if (this.report.departmentSalesPeriod) {
                if (this.report.departmentSalesPeriod.chart === 'Bar Chart') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        isPieChart() {
            if (this.report.departmentSalesPeriod) {
                if (this.report.departmentSalesPeriod.chart === 'Pie Chart') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        //#region pdf
        exportToPdf() {
            const store = this.repo.selecttedStore;
            const data = this.departmentSales;
            const doc = new jsPDF('p', 'pt', 'a4');
            doc.setFont('Open Sans', 'san-serif');
            const leftMargin = 40;
            const topMargin = 140;
            const rowHeight = 20;
            const cell1Width = 200;
            const cell2Width = 100;
            const cell3Width = 100;
            const leftMargin2 = leftMargin +  cell1Width;
            const leftMargin3 = leftMargin2 + cell2Width;
            let currPage = 1;
            let pageNumber = 1;
            let k = 0;
            for (let index = 0; index < data.length; index++) {
                if ( k === 0) {
                    doc.cellInitialize();
                    doc.setFontSize(14);
                    doc.setFontType('normal');
                    doc.setDrawColor(224, 224, 224);
                    doc.cell(leftMargin, topMargin, cell1Width, rowHeight, 'Department', k, 'left');
                    doc.cell(leftMargin2, topMargin, cell2Width, rowHeight, 'Quantity' , k, 'left');
                    doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, 'Amount', k, 'right');
                    doc.setFontSize(12);
                    doc.setFontType('normal');
                    k = k + 1;
                }
                if (currPage <  pageNumber) {
                    currPage =  pageNumber;
                    doc.addPage();
                    doc.cellInitialize();
                    doc.setFontSize(14);
                    doc.setFontType('normal');
                    doc.setDrawColor(224, 224, 224);
                    //#region table header
                    doc.cell(leftMargin, topMargin, cell1Width, rowHeight, 'Department', k, 'left');
                    doc.cell(leftMargin2, topMargin, cell2Width, rowHeight, 'Quantity' , k, 'left');
                    doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, 'Amount', k, 'right');
                    //#endregion table header
                    doc.setFontSize(12);
                    doc.setFontType('normal');
                    k = k + 1;
                }
                const element = data[index];
                doc.setDrawColor(224, 224, 224);
                doc.cell(leftMargin, topMargin, cell1Width, rowHeight, element.department, k, 'left');
                doc.cell(leftMargin2, topMargin, cell2Width, rowHeight, element.qty.toString(), k, 'left');
                doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, element.amount.toFixed(2), k, 'right');
                k = k + 1;
                pageNumber = Math.floor((k - 1) / 30) + 1;
            }
            doc.setFontSize(14);
            doc.setFontType('normal');
            doc.setDrawColor(224, 224, 224);
            //#region Total
            doc.cell(leftMargin, topMargin, cell1Width, rowHeight, 'Total', k, 'left');
            doc.cell(leftMargin2, topMargin, cell2Width, rowHeight, this.getTotalQty().toString(), k, 'left');
            doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, this.getTotalAmount().toFixed(2), k, 'right');
            //#endregion Total
            doc.setFontSize(12);
            doc.setFontType('normal');
            const ele = document.getElementById('chartToPdfDepartmentSales');
            html2canvas(ele).then(canvas => {
                /* Few necessary setting options */
                const imgWidth = 500;
                const pageHeight = 800;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const heightLeft = imgHeight;
                const contentDataURL = canvas.toDataURL('image/png');

                doc.addPage();
                doc.addImage(contentDataURL, 'PNG', 40, 140, imgWidth, imgHeight);
                //#region Page header and footer
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 0; i < pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(12);
                    doc.text(570, 820, doc.internal.getCurrentPageInfo().pageNumber + '/' + pageCount);
                    doc.setDrawColor(0, 0, 0);
                    doc.setFontSize(14);
                    doc.setFontType('normal');
                    doc.text(store.storeName, 40, 40);
                    doc.text(store.address, 40, 60);
                    doc.text(store.city, 40, 80);
                    doc.text(store.postCode, 40, 100);

                    doc.text('Department Sales', 420, 40);
                    doc.text('From: ', 420, 60);
                    const start = new Date(this.report.departmentSalesPeriod.startDate);
                    doc.text(this.report.getDateUkformat(start), 460, 60);
                    doc.text('To  : ', 420, 80);
                    const end = new Date(this.report.departmentSalesPeriod.endDate);
                    doc.text(this.report.getDateUkformat(end), 460, 80);
                    doc.text('User: ', 420, 100);
                    doc.text(this.repo.logedinUser, 460, 100);
                    doc.text('Date: ', 420, 120);
                    doc.text(this.report.getDateUkformat((new Date())), 460, 120);
                    doc.line(40, 130, 555, 130);
                }
                 //#endregion Page header and footer
                doc.save('DepartmentSales.pdf');
              }).catch(e => {
                console.log('Department Sales Report Error.');
                console.log(e);
            });
            /*doc.autoPrint();*/
            /*window.open(doc.output('bloburl'), '_blank');*/
        }
        //#endregion pdf
    }
