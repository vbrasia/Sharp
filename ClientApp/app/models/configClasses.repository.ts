export class Filter {
    userId?: string;
    storeId?: string;
    reset() {
        this.userId = null;
        this.storeId = null;
    }
}
