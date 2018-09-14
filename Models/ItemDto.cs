namespace Sharp.Models
{
    // testing fetch
    public class ItemDto
    {
        public int DepartmentId{get;set;}
        public string DepartmentName{get;set;}="";
        public string Description{get;set;}="";
        public decimal Quantity{get;set;}
        public decimal Amount{get;set;}
        public int SrvNo{get;set;}
        public int TillNo{get;set;} // testing mayura
    }
}