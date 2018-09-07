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
            string Sql= "declare @Items Table ";
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
                            ItemDto d=new ItemDto();
                            //T.dptno,D.Name,T.[Description],T.qty,T.Amount
                            #region Fill Model
                            try{d.DepartmentId=reader.GetInt32(0);}catch{}
                            try{d.DepartmentName=reader.GetString(1).ToUpper();}catch{}
                            try{d.Description=reader.GetString(2).ToUpper();}catch{}
                            try{d.Quantity=reader.GetInt32(3);}catch{}
                            try{d.Amount=reader.GetDecimal(4);}catch{}
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