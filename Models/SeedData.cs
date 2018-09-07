using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Sharp.Models
{
    public class SeedData
    {
        public static void SeedDatabase(DataContext context)
        {
            
            if(context.Database.GetMigrations().Count() > 0 && context.Database.GetPendingMigrations().Count() == 0 )
            {
                if(context.UserStores.Count() == 0)
                {
                    context.UserStores.AddRange(
                        new UserStore{UserId="admin",StoreId="VF1",UserRole="Admin",
                        Email="vbrallert@visualbusinessretail.com",PhoneNumber="0044 2080901449"},
                        new UserStore{UserId="admin",StoreId="VF2",UserRole="Admin",
                        Email="vbrallert@visualbusinessretail.com",PhoneNumber="0044 2080901449"});
                    context.SaveChanges();
                }
                if(context.Stores.Count()==0)
                {
                    context.Stores.AddRange(
                        new Store{StoreId="VF1",StoreName="Visual Fresh",Address="Richmond Road",City="Kingston",PostCode="KT1 5WS"},
                        new Store{StoreId="VF2",StoreName="Visual Sharp",Address="Richmond Road",City="Kingston",PostCode="KT1 5WK",});
                     context.SaveChanges();
                }
                if(context.Authorizations.Count()==0)
                {
                    context.Authorizations.AddRange(
                    new Authorization{Tag="Dashboard",Name="Dashboard",BackOffice=true,Admin=true,
                    Supervisor=true,Manager=true,Cashier=true,Type="Root",RootTag="",ChildTag="",
                    LineNo=20,Icon="fa fa-fw fa-dashboard",Live=true,Css="info-box twitter-bg"},
                    

                    new Authorization{Tag="Reports",Name="Reports",BackOffice=true,Admin=true,
                    Supervisor=true,Manager=true,Cashier=true,Type="Root",RootTag="",ChildTag="",
                    LineNo=30,Icon="fa fa-fw fa-chart-pie",Live=true,Css="info-box magenta-bg"},

                    new Authorization{Tag="Department Sales",Name="Department Sales",BackOffice=true,Admin=true,
                    Supervisor=true,Manager=true,Cashier=true,Type="Child",RootTag="Reports",ChildTag="",
                    LineNo=10,Icon="fa fa-fw fa-chart-line",Live=true,Css="info-box green-bg"},
                    
                    new Authorization{Tag="Item Sales",Name="Item Sales",BackOffice=true,Admin=true,
                    Supervisor=true,Manager=true,Cashier=true,Type="Child",RootTag="Reports",ChildTag="",
                    LineNo=20,Icon="fa fa-fw fa-chart-bar",Live=true,Css="info-box orange-bg"},

                    new Authorization{Tag="Daily Sales",Name="Daily Sales",BackOffice=true,Admin=true,
                    Supervisor=true,Manager=true,Cashier=true,Type="Child",RootTag="Reports",ChildTag="",
                    LineNo=30,Icon="fa fa-fw fa-chart-pie",Live=true,Css="info-box yellow-bg"},                    
                    
                    new Authorization{Tag="Administrator",Name="administrator",BackOffice=true,Admin=true,
                    Supervisor=false,Manager=false,Cashier=false,Type="Root",RootTag="",ChildTag="",
                    LineNo=200,Icon="fa fa-fw fa-user",Live=true,Css="info-box red-bg"},
                    
                    new Authorization{Tag="Users",Name="Users",BackOffice=true,Admin=true,
                    Supervisor=false,Manager=false,Cashier=false,Type="Child",RootTag="Administrator",ChildTag="",
                    LineNo=10,Icon="fa fa-fw fa-users",Live=true,Css="info-box teal-bg"});
                    context.SaveChanges();

                }
            }

        }
    }
}