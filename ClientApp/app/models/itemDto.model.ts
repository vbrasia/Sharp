export class ItemDto {
    constructor(
        public departmentId?: number,
        public departmentName?: string,
        public description?: string,
        public quantity?: number,
        public amount?: number
    ) {}
}
