using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sharp.Models;
namespace Sharp.Ado
{
    public class ItemSales
    {
        public List<ItemDto> GetItemSales(StoreDto m)
        {
            string connectionString="Data Source="+m.PublicIp+"\\SPOSSQL_10,"+m.Port.ToString();
            connectionString +="; Initial Catalog="+m.DataBase+"; User Id=vbr; Password=mg812yn";

            string StartDate=m.StartDate;
            string EndDate=m.EndDate;

            List<ItemDto> lm=new List<ItemDto>();
            #region SQL
          /*  string Sql= "declare @Items Table ";
            Sql +="([Description] varchar(40),dptno int,qty int, Amount money) ";
            Sql +="insert into @Items ";
            Sql +="select [Description],dptno,sum(qty0),sum(qty0*Price) from dbo.TranItems ";
            Sql +="where TrnNo in( ";
            Sql +="select TrnNo from TranHeaders ";
            Sql +="where DateTimeEnd between @SD  and @ED) and voidd =0 ";
            Sql +="group by dptno,[Description] ";

            Sql +="select T.dptno,D.Name,T.[Description],T.qty,T.Amount from @Items T left join Depts D ";
            Sql +="on T.dptno=D.DptNo ";
            Sql +="where T.Amount <>0 ";
            Sql +="order by D.Name,T.[Description] ";*/

            string Sql="declare @Item Table ";
            Sql +="(SrvNo int,Till int,dptno int,[Description] varchar(40),Qty decimal(10,2),Amount money) ";
            Sql +="insert into @Item ";
            Sql +="select h.SrvNo,h.Till,i.dptno,i.Description, sum(i.qty0) Qty,sum(i.qty0*i.Price) Amount ";
            Sql +="from dbo.TranItems i,dbo.TranHeaders h ";
            Sql +="where i.TrnNo=h.TrnNo and h.DateTimeEnd between @SD and @ED ";
            Sql +="group by h.SrvNo,h.Till,i.dptno,i.Description ";
            Sql +="select T.SrvNo,T.Till,T.dptno,T.Qty,T.Amount,D.Name,T.[Description] from @Item T left join Depts D ";
            Sql +="on T.dptno=D.DptNo ";
            Sql +="where T.Amount <> 0 ";
            Sql +="order by D.Name,T.[Description] ";


            #endregion SQL
             #region Execute SQL
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(Sql, connection))
                {
                    #region Param
                    #region @SD
                    SqlParameter param  = new SqlParameter();
                    param.ParameterName="@SD";
                    param.Value=StartDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @SD
                    #region  @ED
                    param  = new SqlParameter();
                    param.ParameterName="@ED";
                    param.Value=EndDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @ED
                    #endregion Param
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while(reader.Read())
                        {
                            //T.SrvNo,T.Till,T.dptno,T.Qty,T.Amount,D.Name,T.[Description]
                            ItemDto d=new ItemDto();
                            #region Fill Model
                            try{d.SrvNo=reader.GetInt32(0);}catch{}
                            try{d.TillNo=reader.GetInt32(1);}catch{}
                            try{d.DepartmentId=reader.GetInt32(2);}catch{}
                            try{d.Quantity=reader.GetDecimal(3);}catch{}
                            try{d.Amount=reader.GetDecimal(4);}catch{}
                            try{d.DepartmentName=reader.GetString(5).ToUpper();}catch{}
                            try{d.Description=reader.GetString(6).ToUpper();}catch{}
                            #endregion Fill Model
                            lm.Add(d);
                        }
                    }
                }
            }
            #endregion Execute SQL
            return lm;
        }
    }
}