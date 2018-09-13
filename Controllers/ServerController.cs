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
    [Route("api/servers")]
    public class ServerController:Controller
    {
        private Repository repo;
        public ServerController(Repository _repo)
        {
            repo=_repo;
        }
        [HttpPost]
        public IActionResult GetServers([FromBody] StoreDto m)
        {
            if (ModelState.IsValid)
            {
                return Ok(repo.GetServers(m));
            }
            else
            {
                return BadRequest();
            }
        } 
    }
}