namespace Sharp.Models
{
    public class TransactionPayments
    {
        public long TrnNo {get;set;}
        public int PymIx {get;set;}
        public int PymNo {get;set;}
        public decimal amnt {get;set;}
        public decimal tndr {get;set;}
        public decimal chng {get;set;}
        public decimal tndrAlt {get;set;}
        public decimal chngAlt {get;set;}
        public int SrvNo {get;set;}
        public int TillNo {get;set;}
        public int pymtype {get;set;}
        public decimal fbasetndr {get;set;}
    }
}