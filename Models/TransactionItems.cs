namespace Sharp.Models
{
    public class TransactionItems
    {
        public long TrnNo{get;set;}
        public int ItemIx{get;set;}
        public long plu{get;set;}
        public decimal qty0{get;set;}
        public decimal qtyr{get;set;}
        public decimal cost{get;set;}
        public decimal price{get;set;}
        public int chrge{get;set;}
        public int vat{get;set;}
        public int overrided {get;set;}
        public int PriceManual{get;set;}
        public string FreeText{get;set;}="";
        public int refund{get;set;}
        public int mmItem{get;set;}
        public int voidd{get;set;}
        public int subitem2{get;set;}
        public int DiscSub{get;set;}
        public int DiscType{get;set;}
        public decimal DiscRate{get;set;}
        public int TimePlanNo{get;set;}
        public int grpno{get;set;}
        public int dptno{get;set;}
        public string Description{get;set;}="";
        public int ProdType{get;set;}
        public int ProdCat{get;set;}
    }
}