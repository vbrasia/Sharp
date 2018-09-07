export class UserStore {
    constructor(
        public id?: number,
        public userId?: string,
        public storeId?: string,
        public userRole?: string,
        public email?: string,
        public phoneNumber?: string
    ) {}
}
