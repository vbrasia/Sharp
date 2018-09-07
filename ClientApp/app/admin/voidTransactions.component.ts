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
const voidTransactionUrl = 'api/voids';
@Component({
    templateUrl: 'voidTransactions.component.html'
    })
    export class VoidTransactionsComponent implements OnInit {
        startDate?: string;
        endDate?: string;
        constructor(private repo: Repository, private report: Report, private localStorage: LocalStorage, private router: Router) {
            if (!repo.selecttedStore) {
                this.router.navigateByUrl('/admin/stores');
            } else {
                if (!this.report.voidTransactionsPeriod.initiated) {
                    this.getPeriod().subscribe(response => {
                        if (response) {
                            this.report.voidTransactionsPeriod = response;
                            this.report.voidTransactionsPeriod.initiated = false;
                        }
                        if ((this.report.voidTransactionsPeriod.startDate) && ( this.report.voidTransactionsPeriod.endDate)) {
                                this.startDate = this.report.voidTransactionsPeriod.startDate;
                                this.endDate = this.report.voidTransactionsPeriod.endDate;
                                this.report.voidTransactionsPeriod.initiated = true;
                                this.getVoidTransactions();
                        }
                    });
                }
            }
        }
        ngOnInit() {
            if ((this.report.voidTransactionsPeriod.startDate) && ( this.report.voidTransactionsPeriod.endDate)) {
                this.startDate = this.report.voidTransactionsPeriod.startDate;
                this.endDate = this.report.voidTransactionsPeriod.endDate;
            }
        }
        get noOfPages() {
            if (this.report.voidTransactions) {
                const pages = Math.ceil(this.report.voidTransactions.noOfLines / this.report.voidTransactionsPeriod.linesPerPage);
                return pages;
            } else {
                return 0;
            }
        }
        set pageNumber(currentPage: number) {
            if (currentPage > 0) {
                this.report.voidTransactionsPeriod.pageNumber = currentPage;
                if (currentPage <= this.noOfPages) {
                    this.getVoidTransactions();
                }
            }

        }
        next() {
            if (this.report.voidTransactionsPeriod.pageNumber < this.noOfPages) {
                this.report.voidTransactionsPeriod.pageNumber = this.report.voidTransactionsPeriod.pageNumber + 1;
                this.getVoidTransactions();
            }
        }
        previous() {
            if (this.report.voidTransactionsPeriod.pageNumber > 1) {
                this.report.voidTransactionsPeriod.pageNumber = this.report.voidTransactionsPeriod.pageNumber - 1;
                this.getVoidTransactions();
            }
        }
        last() {
            if (this.report.voidTransactionsPeriod.pageNumber < this.noOfPages) {
                this.report.voidTransactionsPeriod.pageNumber = this.noOfPages;
                this.getVoidTransactions();
            }
        }
        first() {
            if (this.report.voidTransactionsPeriod.pageNumber > 1) {
                this.report.voidTransactionsPeriod.pageNumber = 1;
                this.getVoidTransactions();
            }
        }
        get pageNumber(): number {
            if (this.report.voidTransactions) {
                if (this.noOfPages === 0) {
                    this.report.voidTransactionsPeriod.pageNumber = 1;
                }
                return this.report.voidTransactionsPeriod.pageNumber;
            }
        }
        private currentPageNumber() {
            if (this.report.voidTransactions) {
                if (this.report.voidTransactionsPeriod.pageNumber > this.noOfPages) {
                    this.report.voidTransactionsPeriod.pageNumber = this.noOfPages;
                }
                if (this.noOfPages === 0) {
                    this.report.voidTransactionsPeriod.pageNumber = 1;
                }
            }
        }
        set linesPerPage(linesPerPage: string ) {
            this.report.voidTransactionsPeriod.linesPerPage = Number(linesPerPage);
            this.currentPageNumber();
            this.getVoidTransactions();
        }
        get linesPerPage(): string {
            return this.report.voidTransactionsPeriod.linesPerPage.toString();
        }
        get screenWidth(): number {
            return this.repo.screenWidth;
        }
        setPeriod(tag?: string) {
            if (tag !== this.report.voidTransactionsPeriod.periodName) {
                this.report.voidTransactionsPeriod.periodName = tag;
                if (tag !== '') {
                    this.startDate = this.report.getStartDateByTag(tag);
                    this.endDate = this.report.getEndDateByTag(tag);
                }
                this.report.voidTransactionsPeriod.startDate = this.startDate;
                this.report.voidTransactionsPeriod.endDate = this.endDate;
                if (tag !== '') {
                    this.getVoidTransactions();
                }
            }
        }
        get period(): string {
            return this.report.voidTransactionsPeriod.periodName;
        }
        getPeriod(): Observable<Period> {
            return this.localStorage.getItem<Period>('voidTransactions');
        }
        savePeriod(period: Period) {
            this.getPeriod().subscribe(response => {
                if (response) {
                    if (response !== period) {
                        this.localStorage.setItem('voidTransactions', period).subscribe(() => {});
                    }
                } else {
                    this.localStorage.setItem('voidTransactions', period).subscribe(() => {});
                }
            });
        }
        get voidTransHeaders(): TransactionHeaders[] {
            if (this.report.voidTransactions) {
                return this.report.voidTransactions.transHeaders.sort((a , b) => {
                    return a.dateTimeEnd.localeCompare(b.dateTimeEnd);
                });
            }
        }
        selectVoidHeader(header: TransactionHeaders) {
            if (this.report.voidSelectedHeader !== header) {
                this.report.voidSelectedHeader = header;
            } else {
                this.report.voidSelectedHeader = null;
            }
        }
        isVoidSelectedHeader(header: TransactionHeaders): boolean {
            if (this.report.voidSelectedHeader !== null) {
                if (this.report.voidSelectedHeader === header) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        get voidTransItems(): TransactionItems[] {
            const trnNo = this.report.voidSelectedHeader.trnNo;
            return this.report.voidTransactions.transItems.filter(x => x.trnNo === trnNo);
        }
        get voidTransPayments(): TransactionPayments[] {
            const trnNo = this.report.voidSelectedHeader.trnNo;
            return this.report.voidTransactions.transPayments.filter(x => x.trnNo === trnNo);
        }
        get voidSelectedHeader(): TransactionHeaders {
            return this.report.voidSelectedHeader;
        }
        setVoidSelectedHeaderNull() {
            this.report.voidSelectedHeader = null;
        }
        getVoidTransactions() {
            const url = voidTransactionUrl + '/sales';
            this.repo.storeDto.startDate = this.startDate;
            this.repo.storeDto.endDate = this.endDate;
            this.repo.storeDto.linesPerPage = this.report.voidTransactionsPeriod.linesPerPage;
            this.repo.storeDto.pageNumber = this.report.voidTransactionsPeriod.pageNumber;
            if ( this.repo.storeDto.startDate &&  this.repo.storeDto.endDate) {
                this.report.voidTransactionsPeriod.startDate = this.startDate;
                this.report.voidTransactionsPeriod.endDate = this.endDate;
                this.repo.apiBusy = true;
                this.savePeriod(this.report.voidTransactionsPeriod);
                this.repo.sendRequest(RequestMethod.Post, url, this.repo.storeDto).subscribe(response => {
                    this.report.voidTransactions = response;
                    this.repo.apiBusy = false;
                });
            }
        }
    }
