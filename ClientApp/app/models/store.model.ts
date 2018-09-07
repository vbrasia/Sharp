export class Store {
    constructor(
        public id?: number,
        public address?: string,
        public city?: string,
        public dataBase?: string,
        public port?: number,
        public postCode?: string,
        public publicIp?: string,
        public storeId?: string,
        public storeName?: string,
        public serialNumber?: string,
        public macAddress?: string,
        public tick?: Date
    ) {}
}
