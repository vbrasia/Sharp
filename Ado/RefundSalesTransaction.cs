using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Sharp.Models;
namespace Sharp.Ado
{
    public class RefundSalesTransaction
    {
        public Transactions GetRefundTransactions(StoreDto m)
        {
            string connectionString="Data Source="+m.PublicIp+"\\SPOSSQL_10,"+m.Port.ToString();
            connectionString +="; Initial Catalog="+m.DataBase+"; User Id=vbr; Password=mg812yn";

            string StartDate=m.StartDate;
            string EndDate=m.EndDate;
            Transactions trans=new Transactions();
            trans.TransHeaders = new List<TransactionHeaders>();
            trans.TransItems = new List<TransactionItems>();
            trans.TransPayments = new List<TransactionPayments>();
            #region SQL
            string Sql ="declare @HowManyLines int ";
            Sql +="declare @Trans Table ";
            Sql +="(RowNumber int,DateTimeStart datetime,DateTimeEnd datetime,TradingDate datetime,TrnNo bigint,TotValue money,";
            Sql +="TblNo int,Split int,SrvNo int,StructVersion bigint,voidd int,BillPrinted int,CashedOff int,Wastage int,";
            Sql +="Receipted int,nitems int,npayms int,ncovers int,TotalDiscS money,trnsplit bigint,Till int,Shift int) ";

            Sql +="declare @TransHeaders Table ";
            Sql +="(DateTimeStart datetime,DateTimeEnd datetime,TradingDate datetime,TrnNo bigint,TotValue money, ";
            Sql +="TblNo int,Split int,SrvNo int,StructVersion bigint,voidd int,BillPrinted int,CashedOff int,Wastage int, ";
            Sql +="Receipted int,nitems int,npayms int,ncovers int,TotalDiscS money,trnsplit bigint,Till int,Shift int) ";

            Sql +="declare @TransNos Table ";
            Sql +="(TrnNo bigint) ";
            Sql +="insert into @TransNos ";
            Sql +="select distinct TrnNo from TranItems where TrnNo in ";
            Sql +="(select TrnNo from TranHeaders where DateTimeEnd between @StartDate and @EndDate) ";
            Sql +="and refund = 1 ";

            Sql +="insert into @Trans ";
            Sql +="select ROW_NUMBER() OVER (ORDER BY DateTimeEnd) AS Row,DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue, ";
            Sql +="TblNo,Split,SrvNo,StructVersion,voidd,BillPrinted,CashedOff,Wastage,Receipted,nitems,npayms,ncovers, ";
            Sql +="TotalDiscS,trnsplit,Till,Shift ";
            Sql +="FROM TranHeaders where (DateTimeEnd between @StartDate and @EndDate) ";
            Sql +="and TrnNo in (select TrnNo from @TransNos) ";
            Sql +="order by DateTimeEnd ";

            Sql +="insert into @TransHeaders  ";
            Sql +="(DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue, ";
            Sql +="TblNo,Split,SrvNo,StructVersion,voidd,BillPrinted,CashedOff,Wastage, ";
            Sql +="Receipted,nitems,npayms,ncovers,TotalDiscS,trnsplit,Till,Shift) ";

            Sql +="select DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue, ";
            Sql +="TblNo,Split,SrvNo,StructVersion,voidd, ";
            Sql +="BillPrinted,CashedOff,Wastage,Receipted,nitems, ";
            Sql +="npayms,ncovers,TotalDiscS,trnsplit,Till,Shift from @Trans ";
            Sql +="WHERE RowNumber > (@PageNumber - 1) * @LinesPerPage ";
            Sql +="AND RowNumber <= @PageNumber * @LinesPerPage ";
            Sql +="order by DateTimeEnd ";

            Sql +="SELECT @HowManyLines = COUNT(RowNumber) FROM @Trans ";

            Sql +="select DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue, ";
            Sql +="TblNo,Split,SrvNo,StructVersion,voidd, ";
            Sql +="BillPrinted,CashedOff,Wastage,Receipted,nitems, ";
            Sql +="npayms,ncovers,TotalDiscS,trnsplit,Till,Shift  ";
            Sql +="from @TransHeaders order by  DateTimeEnd ; ";

            Sql +="select @HowManyLines ;  ";

            Sql +="select TrnNo,ItemIx,plu,qty0,qtyr, ";
            Sql +="cost,price,chrge,vat,[override], ";
            Sql +="PriceManual,[FreeText],refund,mmItem,voidd, ";
            Sql +="subitem2,DiscSub,DiscType,DiscRate,TimePlanNo, ";
            Sql +="grpno,dptno,[Description],ProdType,ProdCat from TranItems ";
            Sql +="where TrnNo in (select TrnNo from @TransHeaders) ";
            Sql +="order by TrnNo,ItemIx  ";

            Sql +="select TrnNo,PymIx,PymNo,amnt,tndr, ";
            Sql +="chng,tndrAlt,chngAlt,SrvNo,TillNo, ";
            Sql +="pymtype,fbasetndr from TranPayments ";
            Sql +="where TrnNo in (select TrnNo from @TransHeaders) ";
            Sql +="order by TrnNo,PymIx  ";
            #endregion SQL
            #region Execute SQL
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(Sql, connection))
                {
                    #region Param
                    #region @StartDate
                    SqlParameter param  = new SqlParameter();
                    param.ParameterName="@StartDate";
                    param.Value=StartDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @StartDate

                    #region @EndDate
                    param  = new SqlParameter();
                    param.ParameterName="@EndDate";
                    param.Value=EndDate;
                    param.DbType=DbType.DateTime;
                    command.Parameters.Add(param);
                    #endregion @EndDate

                    #region @PageNumber
                    param  = new SqlParameter();
                    param.ParameterName="@PageNumber";
                    param.Value=m.PageNumber;
                    param.DbType=DbType.Int32;
                    command.Parameters.Add(param);
                    #endregion @PageNumber

                    #region @LinesPerPage
                    param  = new SqlParameter();
                    param.ParameterName="@LinesPerPage";
                    param.Value=m.LinesPerPage;
                    param.DbType=DbType.Int32;
                    command.Parameters.Add(param);
                    #endregion @LinesPerPage
                    #endregion Param
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            TransactionHeaders h= new TransactionHeaders();
                             #region Fill Model
                            // DateTimeStart,DateTimeEnd,TradingDate,TrnNo,TotValue,
                            #region Line 1
                            h.DateTimeStart =reader.GetDateTime(0);
                            h.DateTimeEnd = reader.GetDateTime(1);
                            h.TradingDate = reader.GetDateTime(2);
                            h.TrnNo = reader.GetInt64(3);
                            h.TotValue = reader.GetDecimal(4);
                            #endregion Line 1
                            // TblNo,Split,SrvNo,StructVersion,voidd,
                            #region Line 2
                            h.TblNo = reader.GetInt32(5);
                            h.Split = reader.GetInt32(6);
                            h.SrvNo = reader.GetInt32(7);
                            h.StructVersion = reader.GetInt64(8);
                            h.voidd = reader.GetInt32(9);
                            #endregion Line 2
                            // BillPrinted,CashedOff,Wastage,Receipted,nitems,
                            #region Line 3
                            h.BillPrinted = reader.GetInt32(10);
                            h.CashedOff = reader.GetInt32(11);
                            h.Wastage = reader.GetInt32(12);
                            h.Receipted = reader.GetInt32(13);
                            h.nitems = reader.GetInt32(14);
                            #endregion Line 3
                            // npayms,ncovers,TotalDiscS,trnsplit,Till,Shift
                            #region Line 4
                            h.npayms =reader.GetInt32(15);
                            h.ncovers = reader.GetInt32(16);
                            h.TotalDiscS = reader.GetDecimal(17);
                            h.trnsplit = reader.GetInt64(18);
                            h.Till = reader.GetInt32(19);
                            h.Shift = reader.GetInt32(20);
                            #endregion Line 4               
                            #endregion Fill Model
                            trans.TransHeaders.Add(h);
                        }
                        if(reader.NextResult())
                        {
                            while(reader.Read())
                            {
                                trans.NoOfLines=reader.GetInt32(0);
                            }
                        }
                        if(reader.NextResult())
                        {
                            while(reader.Read())
                            {
                                TransactionItems l= new TransactionItems();
                                #region Fill Model
                                // TrnNo,ItemIx,plu,qty0,qtyr,
                                #region Line 1
                                l.TrnNo = reader.GetInt64(0);
                                l.ItemIx =reader.GetInt32(1);
                                l.plu = reader.GetInt64(2);
                                l.qty0 = reader.GetDecimal(3);
                                l.qtyr = reader.GetDecimal(4);
                                #endregion Line 1
                                // cost,price,chrge,vat,[override],
                                #region Line 2
                                l.cost =reader.GetDecimal(5);
                                l.price = reader.GetDecimal(6);
                                l.chrge = reader.GetInt32(7);
                                l.vat =reader.GetInt32(8);
                                l.overrided=reader.GetInt32(9);
                                #endregion Line 2
                                // PriceManual,[FreeText],refund,mmItem,voidd,
                                #region Line 3
                                l.PriceManual=reader.GetInt32(10);
                                l.FreeText = reader.GetString(11);
                                l.refund = reader.GetInt32(12);
                                l.mmItem = reader.GetInt32(13);
                                l.voidd =reader.GetInt32(14);
                                #endregion Line 3
                                // subitem2,DiscSub,DiscType,DiscRate,TimePlanNo,
                                #region Line 4
                                l.subitem2=reader.GetInt32(15);
                                l.DiscSub=reader.GetInt32(16);
                                l.DiscType=reader.GetInt32(17);
                                l.DiscRate=reader.GetDecimal(18);
                                l.TimePlanNo=reader.GetInt32(19);
                                #endregion Line 4
                                // grpno,dptno,[Description],ProdType,ProdCat from TranItems
                                #region Line 5
                                l.grpno=reader.GetInt32(20);
                                l.dptno=reader.GetInt32(21);
                                l.Description=reader.GetString(22);
                                l.ProdType=reader.GetInt32(23);
                                l.ProdCat=reader.GetInt32(24);
                                #endregion Line 5
                                #endregion Fill Model
                                trans.TransItems.Add(l);

                            }
                        }
                        if(reader.NextResult())
                        {
                            while(reader.Read())
                            {
                                TransactionPayments p=new TransactionPayments();
                                #region Fill Model
                                //TrnNo,PymIx,PymNo,amnt,tndr
                                #region Line 1
                                p.TrnNo=reader.GetInt64(0);
                                p.PymIx=reader.GetInt32(1);
                                p.PymNo=reader.GetInt32(2);
                                p.amnt=reader.GetDecimal(3);
                                p.tndr=reader.GetDecimal(4);
                                #endregion Line 1
                                //chng,tndrAlt,chngAlt,SrvNo,TillNo,
                                #region Line 2
                                p.chng=reader.GetDecimal(5);
                                p.tndrAlt=reader.GetDecimal(6);
                                p.chngAlt=reader.GetDecimal(7);
                                p.SrvNo=reader.GetInt32(8);
                                p.TillNo=reader.GetInt32(9);
                                #endregion Line 2
                                //pymtype,fbasetndr
                                #region Line 3  
                                p.pymtype =reader.GetInt32(10);
                                p.fbasetndr=reader.GetDecimal(11);
                                #endregion Line 3  
                                #endregion Fill Model
                                trans.TransPayments.Add(p);

                            }
                        }
                    }
                }
            }
            #endregion Execute SQL
            return trans;
        }
    }
}