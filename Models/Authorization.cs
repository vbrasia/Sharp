using System.ComponentModel.DataAnnotations;

namespace Sharp.Models
{
    public class Authorization
    {
        public int Id{get;set;}
        [StringLength(50)]
        public string Tag{get;set;}="";
        [StringLength(50)]
        public string Name{get;set;}="";
        public bool BackOffice{get;set;}=false;
        public bool Admin{get;set;}=false;
        public bool Supervisor{get;set;}=false;
        public bool Manager{get;set;}=false;
        public bool Cashier{get;set;}=false;
        [StringLength(50)]
        public string Type{get;set;}="";
        [StringLength(50)]
        public string RootTag{get;set;}="";
        [StringLength(50)]
        public string ChildTag{get;set;}="";
        public int LineNo{get;set;}
        [StringLength(50)]
        public string Icon{get;set;}="";
        [StringLength(50)]
        public string Css{get;set;}="";
        public bool Live{get;set;}=false;
    }
}