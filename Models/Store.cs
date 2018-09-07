using System;
using System.ComponentModel.DataAnnotations;

namespace Sharp.Models
{
    public class Store
    {
        public long Id{get;set;}
        [StringLength(100)]
        public string Address{get;set;}="";
        [StringLength(50)]
        public string City{get;set;}="";
        [StringLength(50)]
        public string DataBase{get;set;}
        public int Port{get;set;}
        [StringLength(10)]
        public string PostCode{get;set;}="";
        [StringLength(50)]
        public string PublicIp{get;set;}="";
        [StringLength(50)]
        public string StoreId{get;set;}="";
        [StringLength(100)]
        public string StoreName{get;set;}="";
        [StringLength(100)]
        public string SerialNumber{get;set;}="";
        [StringLength(100)]
        public string MacAddress{get;set;}="";
        public DateTime? Tick{get;set;}
    }
}