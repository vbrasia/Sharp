using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sharp.Models;

namespace Sharp.Ado
{
    public class DepartmentSales
    {
        public List<DepartmentDto> GetDepartmentSales(StoreDto m)
        {
            string connectionString="Data Source="+m.PublicIp+"\\SPOSSQL_10,"+m.Port.ToString();
            connectionString +="; Initial Catalog="+m.DataBase+"; User Id=vbr; Password=mg812yn";


            string StartDate=m.StartDate;
            string EndDate=m.EndDate;
            List<DepartmentDto> lm=new List<DepartmentDto>();
            #region SQL

           /* string Sql="declare @Depart Table ";
            Sql+="(dptno int,qty bigint,Amount money) ";
            Sql+="insert into @Depart ";
            Sql+="select dptno,sum(qty0),sum(qty0*Price) from dbo.TranItems ";
            Sql+="where TrnNo in( ";
            Sql+="select TrnNo from TranHeaders ";
            Sql+="where DateTimeEnd between @SD  and @ED) and voidd =0 ";
            Sql+="group by dptno ";
            Sql+="select T.dptno,D.Name,T.qty,T.Amount from @Depart T left join Depts D ";
            Sql+="on T.dptno=D.DptNo ";
            Sql+="where T.Amount <> 0 ";*/

            string Sql="";
            Sql+="select h.SrvNo,h.Till,i.dptno,sum(i.qty0) Qty,sum(i.qty0*i.Price) Amount,i.Description ";
            Sql+="from dbo.TranItems i,dbo.TranHeaders h ";
            Sql+="where i.TrnNo=h.TrnNo and h.DateTimeEnd between @SD and @ED ";
            Sql+="group by h.SrvNo,h.Till,i.dptno,i.Description ";
            

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
                    using(SqlDataReader reader = command.ExecuteReader())
                    {
                        while(reader.Read())
                        {
                            DepartmentDto d=new DepartmentDto();
                            //h.SrvNo,h.Till,i.dptno,sum(i.qty0) Qty,sum(i.qty0*i.Price) Amount,i.Description
                            #region Fill Model
                           
                            try{d.SrvNo=reader.GetInt32(0);}catch{}
                            try{d.Till=reader.GetInt32(1);}catch{}
                            try{d.Id=reader.GetInt32(2);}catch{}
                            try{d.Qty=Convert.ToInt64(reader.GetDecimal(3));}catch{}
                            try{d.Amount=reader.GetDecimal(4);}catch{}
                            try{d.Department=reader.GetString(5).ToUpper();}catch{}
                            
                           /* try{d.Id=reader.GetInt32(0);}catch{}
                            try{d.Department=reader.GetString(1).ToUpper();}catch{}
                            try{d.Qty=reader.GetInt64(2);}catch{}
                            try{d.Amount=reader.GetDecimal(3);}catch{}*/
                            #endregion Fill Model
                            lm.Add(d);
                        }
                    }
                }
            }
            #endregion Execute SQL
            return lm.OrderBy(x => x.Department).ToList<DepartmentDto>();
        }
    }
}