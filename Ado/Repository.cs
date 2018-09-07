using System.Collections.Generic;
using System.Linq;
using Sharp.Models;

namespace Sharp.Ado
{
    public class Repository
    {
        private DataContext Context;
        public Repository(DataContext ctx)
        {
            Context=ctx;
        }
        public List<DepartmentDto> GetDepartmentSales(StoreDto m)
        {
            DepartmentSales ob=new DepartmentSales();
            List<Store> stores=Context.Stores.Where(x=>x.Id==m.Id).ToList<Store>();
            if(stores.Count>0)
            {
                m.PublicIp=stores[0].PublicIp;
                m.Port=stores[0].Port;
                m.DataBase=stores[0].DataBase;
            }
            return ob.GetDepartmentSales(m);
        }
        public List<ItemDto> GetItemSales(StoreDto m)
        {
            ItemSales ob=new ItemSales();
            List<Store> stores=Context.Stores.Where(x=>x.Id==m.Id).ToList<Store>();
            if(stores.Count>0)
            {
                m.PublicIp=stores[0].PublicIp;
                m.Port=stores[0].Port;
                m.DataBase=stores[0].DataBase;
            }
            return ob.GetItemSales(m);
        }
        public List<DailySalesDto> GetDailySales(StoreDto m)
        {
            DailySales ob=new DailySales();
            List<Store> stores=Context.Stores.Where(x=>x.Id==m.Id).ToList<Store>();
            if(stores.Count>0)
            {
                m.PublicIp=stores[0].PublicIp;
                m.Port=stores[0].Port;
                m.DataBase=stores[0].DataBase;
            }
            return ob.GetDailySales(m);
        }
        public Transactions GetTransctions(StoreDto m)
        {
            SalesTransactions ob=new SalesTransactions();
            List<Store> stores=Context.Stores.Where(x=>x.Id==m.Id).ToList<Store>();
            if(stores.Count>0)
            {
                m.PublicIp=stores[0].PublicIp;
                m.Port=stores[0].Port;
                m.DataBase=stores[0].DataBase;
            }
            return ob.GetTransactions(m);
        }
        public Transactions GetVoidTransactions(StoreDto m)
        {
            VoidSalesTransaction ob =new VoidSalesTransaction();
            List<Store> stores=Context.Stores.Where(x=>x.Id==m.Id).ToList<Store>();
            if(stores.Count>0)
            {
                m.PublicIp=stores[0].PublicIp;
                m.Port=stores[0].Port;
                m.DataBase=stores[0].DataBase;
            }
            return ob.GetVoidTransactions(m);
        }
        public Transactions GetRefundTransactions(StoreDto m)
        {
            RefundSalesTransaction ob = new RefundSalesTransaction();
            List<Store> stores=Context.Stores.Where(x=>x.Id==m.Id).ToList<Store>();
            if(stores.Count>0)
            {
                m.PublicIp=stores[0].PublicIp;
                m.Port=stores[0].Port;
                m.DataBase=stores[0].DataBase;
            }
            return ob.GetRefundTransactions(m);
        }
    }
}