export class Period {
    constructor(
        public startDate?: string,
        public endDate?: string,
        public initiated?: boolean,
        public periodName?: string,
        public chart?: string,
        public pageNumber?: number,
        public linesPerPage?: number
    ) {}
}
