using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sharp.Models;
using Microsoft.AspNetCore.Authorization;
namespace Sharp.Controllers
{
    [Authorize]
    [Route("api/users")]
    public class UserStoreController:Controller
    {
         private DataContext Context;
         public UserStoreController(DataContext ctx)
         {
             Context=ctx;
         }

        [HttpGet]
        public IActionResult GetUsers(string storeId)
        {
            return Ok(Context.UserStores.Where(x=>x.StoreId.Equals(storeId)));
        }
    }
}