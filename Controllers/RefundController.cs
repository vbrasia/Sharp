using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sharp.Models;
using Microsoft.AspNetCore.Authorization;
using Sharp.Ado;
namespace Sharp.Controllers
{
    [Authorize]
    [Route("api/refunds")]
    public class RefundController:Controller
    {
        private Repository repo;
        public RefundController(Repository _repo)
        {
            repo=_repo;
        }
        [HttpPost("sales")]
        public IActionResult GetRefundSales([FromBody] StoreDto m)
        {
            if (ModelState.IsValid)
            {
                return Ok(repo.GetRefundTransactions(m));
            }
            else
            {
                return BadRequest();
            }
        }
    }
}