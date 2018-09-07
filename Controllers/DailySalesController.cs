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
    [Route("api/daily")]
    public class DailySalesController:Controller
    {
        private Repository repo;
        public DailySalesController(Repository _repo)
        {
            repo=_repo;
        }
        [HttpPost("sales")]
        public IActionResult GetDailySales([FromBody] StoreDto m)
        {
            if (ModelState.IsValid)
            {
                return Ok(repo.GetDailySales(m));
            }
            else
            {
                return BadRequest();
            }
        }
    }
}