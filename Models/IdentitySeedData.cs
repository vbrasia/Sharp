using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Sharp.Models {

    public static class IdentitySeedData {
        private const string adminUser ="admin";//"uthayathasan@yahoo.com";
        private const string adminPassword ="mg812Y#.";//"MySecret123$";
        private const string adminRole = "Administrator";
        private const string adminEmail="vbrallert@visualbusinessretail.com";
        private const string adminPhoneNo="0044 2080901449";

        public static async Task SeedDatabase(IdentityDataContext context,
                UserManager<IdentityUser> userManager,
                RoleManager<IdentityRole> roleManager) {

            if (context.Database.GetMigrations().Count() > 0
                    && context.Database.GetPendingMigrations().Count() == 0) {

                IdentityRole role = await roleManager.FindByNameAsync(adminRole);
                IdentityUser user = await userManager.FindByNameAsync(adminUser);

                

                if (role == null) {
                    role = new IdentityRole(adminRole);
                    IdentityResult result = await roleManager.CreateAsync(role);
                    if (!result.Succeeded) {
                        throw new Exception("Cannot create role: " + result.Errors.FirstOrDefault());
                    }
                }

                if (user == null) {
                    user = new IdentityUser(adminUser);
                    IdentityResult result = await userManager.CreateAsync(user, adminPassword);
                    if (!result.Succeeded) {
                        throw new Exception("Cannot create user: " + result.Errors.FirstOrDefault());
                    }else{
                         result = await userManager.SetEmailAsync(user,adminEmail);
                         result =await userManager.SetPhoneNumberAsync(user,adminPhoneNo);
                    }
                }

                if (!await userManager.IsInRoleAsync(user, adminRole)) {
                    IdentityResult result = await userManager.AddToRoleAsync(user, adminRole);
                    if (!result.Succeeded) {
                        throw new Exception("Cannot add user to role: " + result.Errors.FirstOrDefault());
                    }
                }
            }
        }

    }
}