import { Component, OnInit } from '@angular/core';
import { Repository } from '../models/repository';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Period} from '../models/period.model';
import * as Chart from 'chart.js';
import { RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Operator/map';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Report} from './report';
import { TransactionHeaders } from '../models/transactionHeaders.model';
import { TransactionItems } from '../models/transactionItems.model';
import { TransactionPayments } from '../models/transactionPayments.model';
const transactionUrl = 'api/transactions';
@Component({
    templateUrl: 'transactions.component.html'
    })
    export class TransactionsComponent implements OnInit {
        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private report: Report, private localStorage: LocalStorage, private router: Router) {
            if (!repo.selecttedStore) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                if (!this.report.transactionsPeriod.initiated) {
                    this.getPeriod().subscribe(response => {
                        if (response) {
                            this.report.transactionsPeriod = response;
                            this.report.transactionsPeriod.initiated = false;
                        }
                        if ((this.report.transactionsPeriod.startDate) && ( this.report.transactionsPeriod.endDate)) {
                                this.startDate = this.report.transactionsPeriod.startDate;
                                this.endDate = this.report.transactionsPeriod.endDate;
                                this.report.transactionsPeriod.initiated = true;
                                this.getTransactions();
                        }
                    });
                }
            }
        }
        ngOnInit() {
            if ((this.report.transactionsPeriod.startDate) && ( this.report.transactionsPeriod.endDate)) {
                this.startDate = this.report.transactionsPeriod.startDate;
                this.endDate = this.report.transactionsPeriod.endDate;
            }
        }
        get noOfPages() {
            if (this.report.transactions) {
                const pages = Math.ceil(this.report.transactions.noOfLines / this.report.transactionsPeriod.linesPerPage);
                return pages;
            } else {
                return 0;
            }
        }
        set pageNumber(currentPage: number) {
            if (currentPage > 0) {
                this.report.transactionsPeriod.pageNumber = currentPage;
                if (currentPage <= this.noOfPages) {
                    this.getTransactions();
                }
            }

        }
        next() {
            if (this.report.transactionsPeriod.pageNumber < this.noOfPages) {
                this.report.transactionsPeriod.pageNumber = this.report.transactionsPeriod.pageNumber + 1;
                this.getTransactions();
            }
        }
        previous() {
            if (this.report.transactionsPeriod.pageNumber > 1) {
                this.report.transactionsPeriod.pageNumber = this.report.transactionsPeriod.pageNumber - 1;
                this.getTransactions();
            }
        }
        last() {
            if (this.report.transactionsPeriod.pageNumber < this.noOfPages) {
                this.report.transactionsPeriod.pageNumber = this.noOfPages;
            this.getTransactions();
            }
        }
        first() {
            if (this.report.transactionsPeriod.pageNumber > 1) {
                this.report.transactionsPeriod.pageNumber = 1;
                this.getTransactions();
            }
        }
        get pageNumber(): number {
            if (this.report.transactions) {
                if (this.noOfPages === 0) {
                    this.report.transactionsPeriod.pageNumber = 1;
                }
                return this.report.transactionsPeriod.pageNumber;
            }
        }
        private currentPageNumber() {
            if (this.report.transactions) {
                if (this.report.transactionsPeriod.pageNumber > this.noOfPages) {
                    this.report.transactionsPeriod.pageNumber = this.noOfPages;
                }
                if (this.noOfPages === 0) {
                    this.report.transactionsPeriod.pageNumber = 1;
                }
            }
        }
        set linesPerPage(linesPerPage: string ) {
            this.report.transactionsPeriod.linesPerPage = Number(linesPerPage);
            this.currentPageNumber();
            this.getTransactions();
        }
        get linesPerPage(): string {
            return this.report.transactionsPeriod.linesPerPage.toString();
        }
        get screenWidth(): number {
            return this.repo.screenWidth;
        }
        setPeriod(tag?: string) {
            if (tag !== this.report.transactionsPeriod.periodName) {
                this.report.transactionsPeriod.periodName = tag;
                if (tag !== '') {
                    this.startDate = this.report.getStartDateByTag(tag);
                    this.endDate = this.report.getEndDateByTag(tag);
                }
                this.report.transactionsPeriod.startDate = this.startDate;
                this.report.transactionsPeriod.endDate = this.endDate;
                if (tag !== '') {
                    this.getTransactions();
                }
            }
        }
        get period(): string {
            return this.report.transactionsPeriod.periodName;
        }
        getPeriod(): Observable<Period> {
            return this.localStorage.getItem<Period>('transactions');
        }
        savePeriod(period: Period) {
            this.getPeriod().subscribe(response => {
                if (response) {
                    if (response !== period) {
                        this.localStorage.setItem('transactions', period).subscribe(() => {});
                    }
                } else {
                    this.localStorage.setItem('transactions', period).subscribe(() => {});
                }
            });
        }
        get transHeaders(): TransactionHeaders[] {
            if (this.report.transactions) {
                return this.report.transactions.transHeaders.sort((a , b) => {
                    return a.dateTimeEnd.localeCompare(b.dateTimeEnd);
                });
            }
        }
        selectHeader(header: TransactionHeaders) {
            if (this.report.selectedHeader !== header) {
                this.report.selectedHeader = header;
            } else {
                this.report.selectedHeader = null;
            }
        }
        isSelectedHeader(header: TransactionHeaders): boolean {
            if (this.report.selectedHeader !== null) {
                if (this.report.selectedHeader === header) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        get transItems(): TransactionItems[] {
            const trnNo = this.report.selectedHeader.trnNo;
            return this.report.transactions.transItems.filter(x => x.trnNo === trnNo);
        }
        get transPayments(): TransactionPayments[] {
            const trnNo = this.report.selectedHeader.trnNo;
            return this.report.transactions.transPayments.filter(x => x.trnNo === trnNo);
        }
        get selectedHeader(): TransactionHeaders {
            return this.report.selectedHeader;
        }
        setSelectedHeaderNull() {
            this.report.selectedHeader = null;
        }
        getTransactions() {
            const url = transactionUrl + '/sales';
            this.repo.storeDto.startDate = this.startDate;
            this.repo.storeDto.endDate = this.endDate;
            this.repo.storeDto.linesPerPage = this.report.transactionsPeriod.linesPerPage;
            this.repo.storeDto.pageNumber = this.report.transactionsPeriod.pageNumber;
            if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
                this.report.transactionsPeriod.startDate = this.startDate;
                this.report.transactionsPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.savePeriod(this.report.transactionsPeriod);
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.report.transactions = response;
                    this.repo.apiBusy = false;
                });
            }
        }
    }
