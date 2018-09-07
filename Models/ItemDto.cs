namespace Sharp.Models
{
    public class ItemDto
    {
        public int DepartmentId{get;set;}
        public string DepartmentName{get;set;}="";
        public string Description{get;set;}="";
        public int Quantity{get;set;}
        public decimal Amount{get;set;}
    }
}