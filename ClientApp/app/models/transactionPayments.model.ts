export class TransactionPayments {
    constructor(
        public trnNo?: number,
        public pymIx?: number,
        public pymNo?: number,
        public amnt?: number,
        public tndr?: number,
        public chng?: number,
        public tndrAlt?: number,
        public chngAlt?: number,
        public srvNo?: number,
        public tillNo?: number,
        public pymtype?: number,
        public fbasetndr?: number
    ) {}
}
