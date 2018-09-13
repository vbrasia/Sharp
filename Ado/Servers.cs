using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sharp.Models;

namespace Sharp.Ado
{
    public class Servers
    {
        public List<ServerDto> GetServers(StoreDto m){
            string connectionString="Data Source="+m.PublicIp+"\\SPOSSQL_10,"+m.Port.ToString();
            connectionString +="; Initial Catalog="+m.DataBase+"; User Id=vbr; Password=mg812yn";

            List<ServerDto> lm = new List<ServerDto>();
            
            #region SQL
            string Sql="select SrvNo,Name from [Servers] ";
            #endregion SQL

            #region Execute SQL
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(Sql, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while(reader.Read())
                        {
                            ServerDto d=new ServerDto();
                            #region Fill Model
                            try{d.SrvNo=reader.GetInt32(0);}catch{}
                            try{d.Name=reader.GetString(1);}catch{}
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