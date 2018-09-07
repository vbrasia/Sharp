using System;

namespace Sharp.Models
{
    public class StoreDto
    {
        public long Id{get;set;}
        public string Address{get;set;}="";
        public string City{get;set;}="";
        public string DataBase{get;set;}
        public int Port{get;set;}
        public string PostCode{get;set;}="";
        public string PublicIp{get;set;}="";
        public string StoreId{get;set;}="";
        public string StoreName{get;set;}="";
        public string SerialNumber{get;set;}="";
        public string MacAddress{get;set;}="";
        public DateTime? Tick{get;set;}
        public string StartDate{get;set;}="";
        public string EndDate{get;set;}="";
        public int PageNumber{get;set;}=0;
        public int LinesPerPage{get;set;}=0;
    }
}