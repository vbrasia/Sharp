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
    [Route("api/voids")]
    public class VoidController: Controller
    {
        private Repository repo;
        public VoidController(Repository _repo)
        {
            repo=_repo;
        }
        [HttpPost("sales")]
        public IActionResult GetVoidSales([FromBody] StoreDto m)
        {
            if (ModelState.IsValid)
            {
                return Ok(repo.GetVoidTransactions(m));
            }
            else
            {
                return BadRequest();
            }
        }
    }
}