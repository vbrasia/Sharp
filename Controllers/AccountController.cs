using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Sharp.Models;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Sharp.Controllers
{
    public class AccountController : Controller
    {
        private UserManager<IdentityUser> userManager;
        private SignInManager<IdentityUser> signInManager;
        private RoleManager<IdentityRole> roleManager;
        private IdentityDataContext IdentityContext;
         private DataContext dataContext;
        public AccountController(IdentityDataContext identityCtx,UserManager<IdentityUser> userMgr,
        SignInManager<IdentityUser> signInMgr,RoleManager<IdentityRole> roleMgr,DataContext dataCtx) 
        {
            userManager = userMgr;
            signInManager = signInMgr;
            roleManager=roleMgr;
            IdentityContext=identityCtx;
            dataContext=dataCtx;
        }
        [HttpGet("api/account/users")]
        public IEnumerable<User> GetUsers(string storeId)
        {
            List<User> Users=new List<User>();
            foreach(IdentityUser iu in IdentityContext.Users)
            {
                User u =new User();
                u.UserName=iu.UserName;
                u.Email=iu.Email;
                u.PhoneNumber=iu.PhoneNumber;
                Users.Add(u);
            }
            return Users;
        }
        [HttpGet]
        public IActionResult Login(string returnUrl) 
        {
            ViewBag.returnUrl = returnUrl;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel creds,string returnUrl) 
        {
            if (ModelState.IsValid) 
            {
                if (await DoLogin(creds)) 
                {
                    return Redirect(returnUrl ?? "/");
                } 
                else 
                {
                    ModelState.AddModelError("", "Invalid username or password");
                }
            }
            return View(creds);
        }
        [HttpPost("/api/account/login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel creds) 
        {
            if (ModelState.IsValid && await DoLogin(creds)) 
            {
                return Ok();
            }
            return BadRequest();
        }
        
        [HttpPost]
        public async Task<IActionResult> Logout(string redirectUrl) 
        {
            await signInManager.SignOutAsync();
            return Redirect(redirectUrl ?? "/");
        }
        [HttpPost("/api/account/logout")]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }
        private async Task<bool> DoLogin(LoginViewModel creds)
        {
            IdentityUser user = await userManager.FindByNameAsync(creds.Name);
            if (user != null) 
            {
                await signInManager.SignOutAsync();
                Microsoft.AspNetCore.Identity.SignInResult result =
                await signInManager.PasswordSignInAsync(user, creds.Password,false, false);
                return result.Succeeded;
            }
            return false;
        }

    }
    public class LoginViewModel 
    {
        [Required]
        public string Name {get; set;}
        [Required]
        public string Password { get; set;}
    }
}