export class TransactionItems {
    constructor(
        public trnNo?: number,
        public itemIx?: number,
        public plu?: number,
        public qty0?: number,
        public qtyr?: number,
        public cost?: number,
        public price?: number,
        public chrge?: number,
        public vat?: number,
        public overrided?: number,
        public priceManual?: number,
        public freeText?: string,
        public refund?: number,
        public mmItem?: number,
        public voidd?: number,
        public subitem2?: number,
        public discSub?: number,
        public discType?: number,
        public discRate?: number,
        public timePlanNo?: number,
        public grpno?: number,
        public dptno?: number,
        public description?: string,
        public prodType?: number,
        public prodCat?: number
    ) {}
}
