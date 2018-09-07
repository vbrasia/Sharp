import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import {DailySalesDto} from '../models/dailySalesDto.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Period} from '../models/period.model';
import * as Chart from 'chart.js';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Operator/map';
import { Report } from './report';
const dailySalesUrl = 'api/daily';
@Component({
    templateUrl: 'dailySales.component.html'
    })
export class DailySalesComponent implements OnInit {
    BarChart: any;
    PieChart: any;
    startDate?: string;
    endDate?: string;
    constructor(private repo: Repository, private localStorage: LocalStorage, private report: Report, private router: Router) {
        if (!repo.selecttedStore) {
            this.router.navigateByUrl('/admin/stores');
        } else {
            if (!this.report.dailySalesPeriod.initiated) {
                this.getPeriod().subscribe(response => {
                    if (response) {
                        this.report.dailySalesPeriod = response;
                        this.report.dailySalesPeriod.initiated = false;
                    }
                    if (( this.report.dailySalesPeriod.startDate) && ( this.report.dailySalesPeriod.endDate)) {
                        this.startDate = this.report.dailySalesPeriod.startDate;
                        this.endDate = this.report.dailySalesPeriod.endDate;
                        this.report.dailySalesPeriod.initiated = true;
                        this.getDailySales();
                    }
                });
            }
        }
    }
    ngOnInit() {
        if (( this.report.dailySalesPeriod.startDate) && ( this.report.dailySalesPeriod.endDate)) {
            this.startDate = this.report.dailySalesPeriod.startDate;
            this.endDate = this.report.dailySalesPeriod.endDate;
            if (!this.BarChart) {
                this.getBarChart();
            } else {
                this.removeData(this.BarChart);
                this.addData(this.BarChart, this.chartLabels,
                this.dailySales.map(x => x.amount));
            }
            if (!this.PieChart) {
                this.getPieChart();
            } else {
                this.removeData(this.PieChart);
                this.addData(this.PieChart, this.chartLabels,
                this.dailySales.map(x => x.amount));
            }
        }
    }
    get screenWidth(): number {
        return this.repo.screenWidth;
    }
    getBarChart() {
        this.BarChart = new Chart('barChart', {
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
    getPieChart() {
        this.PieChart = new Chart('pieChart', {
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
    getDailySales() {
        const url = dailySalesUrl + '/sales';
        this.repo.storeDto.startDate = this.startDate;
        this.repo.storeDto.endDate = this.endDate;
        if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
            this.report.dailySalesPeriod.startDate = this.startDate;
            this.report.dailySalesPeriod.endDate = this.endDate;
            this.repo.apiBusy = true;
            this.savePeriod(this.report.dailySalesPeriod);
            this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                this.report.dailySales = response;
                if (!this.BarChart) {
                    this.getBarChart();
                } else {
                    this.removeData(this.BarChart);
                    this.addData(this.BarChart, this.chartLabels,
                    this.dailySales.map(x => x.amount));
                }
                if (!this.PieChart) {
                    this.getPieChart();
                } else {
                    this.removeData(this.PieChart);
                    this.addData(this.PieChart, this.chartLabels,
                    this.dailySales.map(x => x.amount));
                }
                this.repo.apiBusy = false;
            });
        }
    }
    getTotalAmount(): number {
        if ((this.dailySales) && (this.dailySales.length > 0)) {
            return this.dailySales.map(x => x.amount).reduce((s, u) => s + u + 0);
        } else {
            return 0;
        }
    }
    getTotalTrans(): number {
        if ((this.dailySales) && (this.dailySales.length > 0)) {
            return this.dailySales.map(x => x.trans).reduce((s, u) => s + u + 0);
        } else {
            return 0;
        }
    }
    get dailySales(): DailySalesDto[] {
        return this.report.dailySales;
    }
    get chartLabels() {
        const label = [];
        this.dailySales.forEach(element => {
            label.push(element.dayDate + ' : ' + element.dayName);
        });
        return label;
    }
    setPeriod(tag?: string) {
        if (tag !== this.report.dailySalesPeriod.periodName) {
            this.report.dailySalesPeriod.periodName = tag;
            if (tag !== '') {
                this.startDate = this.report.getStartDateByTag(tag);
                this.endDate = this.report.getEndDateByTag(tag);
            }
            this.report.dailySalesPeriod.startDate = this.startDate;
            this.report.dailySalesPeriod.endDate = this.endDate;
            if (tag !== '') {
                this.getDailySales();
            }
        }
    }
    get period(): string {
        return this.report.dailySalesPeriod.periodName;
    }
    setChart(tag?: string) {
        this.report.dailySalesPeriod.chart = tag;
        this.savePeriod(this.report.dailySalesPeriod);
    }
    get chart(): string {
        return this.report.dailySalesPeriod.chart;
    }
    savePeriod(period: Period) {
        this.getPeriod().subscribe(response => {
            if (response) {
                if (response !== period) {
                    this.localStorage.setItem('dailySales', period).subscribe(() => {});
                }
            } else {
                this.localStorage.setItem('dailySales', period).subscribe(() => {});
            }
        });
    }
    getPeriod(): Observable<Period> {
        return this.localStorage.getItem<Period>('dailySales');
    }
    isBarchart() {
        if (this.report.dailySalesPeriod) {
            if (this.report.dailySalesPeriod.chart === 'Bar Chart') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    isPieChart() {
        if (this.report.dailySalesPeriod) {
            if (this.report.dailySalesPeriod.chart === 'Pie Chart') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    exportToPdf() {
        const store = this.repo.selecttedStore;
            const data = this.dailySales;
            const doc = new jsPDF('p', 'pt', 'a4');
            doc.setFont('Open Sans', 'san-serif');
            const leftMargin = 40;
            const topMargin = 140;
            const rowHeight = 20;
            const cell1Width = 80;
            const cell2Width = 100;
            const cell3Width = 80;
            const cell4Width = 100;
            const leftMargin2 = leftMargin +  cell1Width;
            const leftMargin3 = leftMargin2 + cell2Width;
            const leftMargin4 = leftMargin3 + cell3Width;
            let currPage = 1;
            let pageNumber = 1;
            let k = 0;
            for (let index = 0; index < data.length; index++) {
                if ( k === 0) {
                    doc.cellInitialize();
                    doc.setFontSize(14);
                    doc.setFontType('normal');
                    doc.setDrawColor(224, 224, 224);
                    doc.cell(leftMargin, topMargin, cell1Width, rowHeight, 'Date', k, 'left');
                    doc.cell(leftMargin2, topMargin, cell2Width, rowHeight, 'Day' , k, 'left');
                    doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, 'Transactions', k, 'left');
                    doc.cell(leftMargin4, topMargin, cell4Width, rowHeight, 'Amount', k, 'right');
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
                    doc.cell(leftMargin, topMargin, cell1Width, rowHeight, 'Date', k, 'left');
                    doc.cell(leftMargin2, topMargin, cell2Width, rowHeight, 'Day' , k, 'left');
                    doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, 'Transactions', k, 'left');
                    doc.cell(leftMargin4, topMargin, cell4Width, rowHeight, 'Amount', k, 'right');
                    doc.setFontSize(12);
                    doc.setFontType('normal');
                    k = k + 1;
                }
                // endregion table header
                const element = data[index];
                doc.setDrawColor(224, 224, 224);
                doc.cell(leftMargin, topMargin, cell1Width, rowHeight, element.dayDate, k, 'left');
                doc.cell(leftMargin2, topMargin, cell2Width, rowHeight, element.dayName, k, 'left');
                doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, element.trans.toString(), k, 'left');
                doc.cell(leftMargin4, topMargin, cell4Width, rowHeight, element.amount.toFixed(2), k, 'right');
                k = k + 1;
                pageNumber = Math.floor((k - 1) / 30) + 1;
            }
            // total
            doc.setFontSize(14);
            doc.setFontType('normal');
            doc.setDrawColor(224, 224, 224);
            doc.cell(leftMargin, topMargin, cell1Width + cell2Width, rowHeight, 'Total', k, 'left');
            doc.cell(leftMargin3, topMargin, cell3Width, rowHeight, this.getTotalTrans().toString(), k, 'left');
            doc.cell(leftMargin4, topMargin, cell4Width, rowHeight, this.getTotalAmount().toFixed(2), k, 'right');
            doc.setFontSize(12);
            doc.setFontType('normal');
            // endregion total
            const ele = document.getElementById('chartToPdfDailySales');
            html2canvas(ele).then(canvas => {
                // Few necessary setting options
                const imgWidth = 500;
                const pageHeight = 800;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const heightLeft = imgHeight;
                const contentDataURL = canvas.toDataURL('image/png');

                doc.addPage();
                doc.addImage(contentDataURL, 'PNG', 40, 140, imgWidth, imgHeight);
                // region Page header and footer
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

                    doc.text('Daily Sales', 420, 40);
                    doc.text('From: ', 420, 60);
                    const start = new Date(this.report.dailySalesPeriod.startDate);
                    doc.text(this.report.getDateUkformat(start), 460, 60);
                    doc.text('To  : ', 420, 80);
                    const end = new Date(this.report.dailySalesPeriod.endDate);
                    doc.text(this.report.getDateUkformat(end), 460, 80);
                    doc.text('User: ', 420, 100);
                    doc.text(this.repo.logedinUser, 460, 100);
                    doc.text('Date: ', 420, 120);
                    doc.text(this.report.getDateUkformat((new Date())), 460, 120);
                    doc.line(40, 130, 555, 130);
                }
                 // endregion Page header and footer
                doc.save('DailySales.pdf');
              }).catch(e => {
                console.log('Daily Sales Report Error.');
                console.log(e);
            });
    }
}
