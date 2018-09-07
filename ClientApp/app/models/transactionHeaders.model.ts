export class TransactionHeaders {
    constructor(
        public dateTimeStart?: string,
        public dateTimeEnd?: string,
        public tradingDate?: string,
        public trnNo?: number,
        public totValue?: number,
        public tblNo?: number,
        public split?: number,
        public srvNo?: number,
        public structVersion?: number,
        public voidd?: number,
        public billPrinted?: number,
        public cashedOff?: number,
        public wastage?: number,
        public receipted?: number,
        public nitems?: number,
        public npayms?: number,
        public ncovers?: number,
        public totalDiscS?: number,
        public trnsplit?: number,
        public till?: number,
        public shift?: number
    ) {}
}
