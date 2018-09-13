namespace Sharp.Models
{
    public class DepartmentDto
    {
        public int Id{get;set;}
        public string Department{get;set;}="";
        public decimal Qty{get;set;}
        public decimal Amount{get;set;}
        public int SrvNo {get;set;}
        public int Till{get;set;}
    }
}