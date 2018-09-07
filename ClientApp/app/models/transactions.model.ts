import { TransactionHeaders } from './transactionHeaders.model';
import { TransactionItems } from './transactionItems.model';
import { TransactionPayments } from './transactionPayments.model';

export class Transactions {
    constructor(
        public noOfLines?: number,
        public transHeaders?: TransactionHeaders[],
        public transItems?: TransactionItems[],
        public transPayments?: TransactionPayments[]
    ) {}
}
