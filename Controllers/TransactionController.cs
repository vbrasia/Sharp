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
    [Route("api/transactions")]
    public class TransactionController:Controller
    {
        private Repository repo;
        public TransactionController(Repository _repo)
        {
            repo=_repo;
        }
        [HttpPost("sales")]
        public IActionResult GetItemSales([FromBody] StoreDto m)
        {
            if (ModelState.IsValid)
            {
                return Ok(repo.GetTransctions(m));
            }
            else
            {
                return BadRequest();
            }
        }
        
    }
}