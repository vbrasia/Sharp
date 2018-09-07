export class Authorization {
    constructor(
        public id?: number,
        public tag?: string,
        public name?: string,
        public backOffice?: boolean,
        public admin?: boolean,
        public supervisor?: boolean,
        public manager?: boolean,
        public cashier?: boolean,
        public type?: string,
        public rootTag?: string,
        public childTag?: string,
        public lineNo?: number,
        public icon?: string,
        public css?: string,
        public live?: boolean
    ) {}
}
