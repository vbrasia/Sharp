namespace Sharp.Models
{
    public class DailySalesDto
    {
        public string DayDate{get;set;}="";
        public string DayName{get;set;}="";
        public decimal Amount{get;set;}
        public int Trans{get;set;}
        public int SrvNo {get;set;}
        public int TillNo {get;set;}
    }
}