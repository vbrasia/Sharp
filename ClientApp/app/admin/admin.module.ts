import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import {StoresComponent} from './stores.component';
import {SidebarComponent} from './sidebar.component';
import {TopbarComponent} from './topbar.component';
import {NodesComponent} from './nodes.component';
import {ChildsComponent} from './childs.component';
import {DepartmentsSalesComponent} from './departmentsSales.component';
import {ItemsSalesComponent} from './ItemsSales.component';
import {Interface} from './interface';
import {TreeEvents} from './treeEvents';
import { Report } from './report';
import { DailySalesComponent } from './dailySales.component';
import { BreadcrumbComponent } from './breadcrumb.component';
import { UserComponent } from './user.component';
import { TransactionsComponent } from './transactions.component';
import {DashboardComponent} from './dashboard.component';
import { Dashboard } from './dashboard';
import { VoidTransactionsComponent } from './voidTransactions.component';
import { RefundTransactionsComponent } from './refundTransactions.component';
@NgModule({
imports: [BrowserModule, RouterModule, FormsModule],
declarations: [AdminComponent, StoresComponent, SidebarComponent, TopbarComponent, NodesComponent, ChildsComponent,
    DepartmentsSalesComponent, ItemsSalesComponent, DailySalesComponent, BreadcrumbComponent, UserComponent,
     TransactionsComponent, DashboardComponent, VoidTransactionsComponent, RefundTransactionsComponent],
providers: [Interface, TreeEvents, Report, Dashboard]
})
export class AdminModule {}
