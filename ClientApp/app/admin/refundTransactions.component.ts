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
const refundTransactionUrl = 'api/refunds';
@Component({
    templateUrl: 'refundTransactions.component.html'
    })
    export class RefundTransactionsComponent implements OnInit {
        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private report: Report, private localStorage: LocalStorage, private router: Router) {
            if (!repo.selecttedStore) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                if (!this.report.refundTransactionsPeriod.initiated) {
                    this.getPeriod().subscribe(response => {
                        if (response) {
                            this.report.refundTransactionsPeriod = response;
                            this.report.refundTransactionsPeriod.initiated = false;
                        }
                        if ((this.report.refundTransactionsPeriod.startDate) && ( this.report.refundTransactionsPeriod.endDate)) {
                                this.startDate = this.report.refundTransactionsPeriod.startDate;
                                this.endDate = this.report.refundTransactionsPeriod.endDate;
                                this.report.refundTransactionsPeriod.initiated = true;
                                this.getRefundTransactions();
                        }
                    });
                }
            }
        }
        ngOnInit() {
            if ((this.report.refundTransactionsPeriod.startDate) && ( this.report.refundTransactionsPeriod.endDate)) {
                this.startDate = this.report.refundTransactionsPeriod.startDate;
                this.endDate = this.report.refundTransactionsPeriod.endDate;
            }
        }
        get noOfPages() {
            if (this.report.refundTransactions) {
                const pages = Math.ceil(this.report.refundTransactions.noOfLines / this.report.refundTransactionsPeriod.linesPerPage);
                return pages;
            } else {
                return 0;
            }
        }
        set pageNumber(currentPage: number) {
            if (currentPage > 0) {
                this.report.refundTransactionsPeriod.pageNumber = currentPage;
                if (currentPage <= this.noOfPages) {
                    this.getRefundTransactions();
                }
            }
        }
        next() {
            if (this.report.refundTransactionsPeriod.pageNumber < this.noOfPages) {
                this.report.refundTransactionsPeriod.pageNumber = this.report.refundTransactionsPeriod.pageNumber + 1;
                this.getRefundTransactions();
            }
        }
        previous() {
            if (this.report.refundTransactionsPeriod.pageNumber > 1) {
                this.report.refundTransactionsPeriod.pageNumber = this.report.refundTransactionsPeriod.pageNumber - 1;
                this.getRefundTransactions();
            }
        }
        last() {
            if (this.report.refundTransactionsPeriod.pageNumber < this.noOfPages) {
                this.report.refundTransactionsPeriod.pageNumber = this.noOfPages;
                this.getRefundTransactions();
            }
        }
        first() {
            if (this.report.refundTransactionsPeriod.pageNumber > 1) {
                this.report.refundTransactionsPeriod.pageNumber = 1;
                this.getRefundTransactions();
            }
        }
        get pageNumber(): number {
            if (this.report.refundTransactions) {
                if (this.noOfPages === 0) {
                    this.report.refundTransactionsPeriod.pageNumber = 1;
                }
                return this.report.refundTransactionsPeriod.pageNumber;
            }
        }
        private currentPageNumber() {
            if (this.report.refundTransactions) {
                if (this.report.refundTransactionsPeriod.pageNumber > this.noOfPages) {
                    this.report.refundTransactionsPeriod.pageNumber = this.noOfPages;
                }
                if (this.noOfPages === 0) {
                    this.report.refundTransactionsPeriod.pageNumber = 1;
                }
            }
        }
        set linesPerPage(linesPerPage: string ) {
            this.report.refundTransactionsPeriod.linesPerPage = Number(linesPerPage);
            this.currentPageNumber();
            this.getRefundTransactions();
        }
        get linesPerPage(): string {
            return this.report.refundTransactionsPeriod.linesPerPage.toString();
        }
        get screenWidth(): number {
            return this.repo.screenWidth;
        }
        setPeriod(tag?: string) {
            if (tag !== this.report.refundTransactionsPeriod.periodName) {
                this.report.refundTransactionsPeriod.periodName = tag;
                if (tag !== '') {
                    this.startDate = this.report.getStartDateByTag(tag);
                    this.endDate = this.report.getEndDateByTag(tag);
                }
                this.report.refundTransactionsPeriod.startDate = this.startDate;
                this.report.refundTransactionsPeriod.endDate = this.endDate;
                if (tag !== '') {
                    this.getRefundTransactions();
                }
            }
        }
        get period(): string {
            return this.report.refundTransactionsPeriod.periodName;
        }
        getPeriod(): Observable<Period> {
            return this.localStorage.getItem<Period>('refundTransactions');
        }
        savePeriod(period: Period) {
            this.getPeriod().subscribe(response => {
                if (response) {
                    if (response !== period) {
                        this.localStorage.setItem('refundTransactions', period).subscribe(() => {});
                    }
                } else {
                    this.localStorage.setItem('refundTransactions', period).subscribe(() => {});
                }
            });
        }
        get refundTransHeaders(): TransactionHeaders[] {
            if (this.report.refundTransactions) {
                return this.report.refundTransactions.transHeaders.sort((a , b) => {
                    return a.dateTimeEnd.localeCompare(b.dateTimeEnd);
                });
            }
        }
        selectRefundHeader(header: TransactionHeaders) {
            if (this.report.refundSelectedHeader !== header) {
                this.report.refundSelectedHeader = header;
            } else {
                this.report.refundSelectedHeader = null;
            }
        }
        isRefundSelectedHeader(header: TransactionHeaders): boolean {
            if (this.report.refundSelectedHeader !== null) {
                if (this.report.refundSelectedHeader === header) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        get refundTransItems(): TransactionItems[] {
            const trnNo = this.report.refundSelectedHeader.trnNo;
            return this.report.refundTransactions.transItems.filter(x => x.trnNo === trnNo);
        }
        get refundTransPayments(): TransactionPayments[] {
            const trnNo = this.report.refundSelectedHeader.trnNo;
            return this.report.refundTransactions.transPayments.filter(x => x.trnNo === trnNo);
        }
        get refundSelectedHeader(): TransactionHeaders {
            return this.report.refundSelectedHeader;
        }
        setRefundSelectedHeaderNull() {
            this.report.refundSelectedHeader = null;
        }
        getRefundTransactions() {
            const url = refundTransactionUrl + '/sales';
            this.repo.storeDto.startDate = this.startDate;
            this.repo.storeDto.endDate = this.endDate;
            this.repo.storeDto.linesPerPage = this.report.refundTransactionsPeriod.linesPerPage;
            this.repo.storeDto.pageNumber = this.report.refundTransactionsPeriod.pageNumber;
            if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
                this.report.refundTransactionsPeriod.startDate = this.startDate;
                this.report.refundTransactionsPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.savePeriod(this.report.refundTransactionsPeriod);
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.report.refundTransactions = response;
                    this.repo.apiBusy = false;
                });
            }
        }
    }
