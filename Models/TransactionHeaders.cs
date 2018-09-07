using System;

namespace Sharp.Models
{
    public class TransactionHeaders
    {
        public DateTime? DateTimeStart{get;set;}
        public DateTime? DateTimeEnd{get;set;}
        public DateTime? TradingDate{get;set;}
        public long TrnNo{get;set;}
        public decimal TotValue{get;set;}
        public int TblNo{get;set;}
        public int Split{get;set;}
        public int SrvNo{get;set;}
        public long StructVersion{get;set;}
        public int voidd{get;set;}
        public int BillPrinted{get;set;}
        public int CashedOff{get;set;}
        public int Wastage{get;set;}
        public int Receipted{get;set;}
        public int nitems{get;set;}
        public int npayms{get;set;}
        public int ncovers{get;set;}
        public decimal TotalDiscS{get;set;}
        public long trnsplit{get;set;}
        public int Till{get;set;}
        public int Shift{get;set;}
    }
}