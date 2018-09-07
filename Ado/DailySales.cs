using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sharp.Models;
namespace Sharp.Ado
{
    public class DailySales
    {
        public List<DailySalesDto> GetDailySales(StoreDto m)
        {
            string connectionString="Data Source="+m.PublicIp+"\\SPOSSQL_10,"+m.Port.ToString();
            connectionString +="; Initial Catalog="+m.DataBase+"; User Id=vbr; Password=mg812yn";

            string StartDate=m.StartDate;
            string EndDate=m.EndDate;
            List<DailySalesDto> lm=new List<DailySalesDto>();
            #region SQL
            string Sql = "declare @S Table ";
            Sql +="(TrnNo bigint,Amount money,DayDate varchar(20),[DayName] varchar(50)) ";
            Sql +="insert into @S ";
            Sql +="select I.TrnNo,sum(I.qty0*I.price) Amount,H.Dt,DATENAME(dw,H.Dt) [DayName] from TranItems I left join ( ";
            Sql +="select TrnNo,DateTimeEnd, CONVERT(date, DateTimeEnd) Dt from dbo.TranHeaders) as H ";
            Sql +="on I.TrnNo=H.TrnNo ";
            Sql +="where I.voidd=0 and DateTimeEnd between @Sd and @Ed ";
            Sql +="group by I.TrnNo,H.Dt ";
            Sql +="order by H.Dt ";
            Sql +="select DayDate,[DayName],SUM(Amount) Amount, COUNT(TrnNo) Trns from @S ";
            Sql +="group by DayDate,[DayName] ";
            Sql +="order by DayDate ";
            #endregion SQL
            #region Execute SQL
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(Sql, connection))
                {
                    #region Param
                    #region @Sd
                    SqlParameter param  = new SqlParameter();
                    param.ParameterName="@Sd";
                    param.Value=StartDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @Sd
                    #region  @Ed
                    param  = new SqlParameter();
                    param.ParameterName="@Ed";
                    param.Value=EndDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @Ed
                    #endregion Param
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while(reader.Read())
                        {
                            DailySalesDto d=new DailySalesDto();
                            // DayDate,[DayName],SUM(Amount) Amount
                            #region Fill Model
                            try{d.DayDate=reader.GetString(0);}catch{}
                            try{d.DayName=reader.GetString(1);}catch{}
                            try{d.Amount=reader.GetDecimal(2);}catch{}
                            try{d.Trans=reader.GetInt32(3);}catch{}
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