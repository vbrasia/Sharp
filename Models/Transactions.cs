using System.Collections.Generic;

namespace Sharp.Models
{
    public class Transactions
    {
        public int NoOfLines{get;set;}
        public List<TransactionHeaders> TransHeaders{get;set;}
        public List<TransactionItems> TransItems{get;set;}
        public List<TransactionPayments> TransPayments{get;set;}
    }
}