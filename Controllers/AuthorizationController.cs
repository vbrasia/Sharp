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
    
    [Route("api/authorizations")]
    public class AuthorizationController:Controller
    {
        private DataContext Context;
        public AuthorizationController(DataContext ctx)
        {
            Context=ctx;
        }
        [HttpGet]
        public  IActionResult GetAuthorizations()
        {
            return Ok(Context.Authorizations.Where(x=>x.Live && x.BackOffice));
        }
    }
}