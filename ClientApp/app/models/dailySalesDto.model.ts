export class DailySalesDto {
    constructor(
        public dayDate?: string,
        public dayName?: string,
        public amount?: number,
        public trans?: number,
        public srvNo?: number,
        public tillNo?: number
    ) {}
}
