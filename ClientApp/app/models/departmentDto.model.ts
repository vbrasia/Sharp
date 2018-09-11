export class DepartmentDto {
    constructor(
        public id?: number,
        public department?: string,
        public qty?: number,
        public amount?: number,
        public srvNo?: number,
        public till?: number
    ) {}
}
