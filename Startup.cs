using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Sharp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;
using Sharp.Ado;

namespace Sharp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<IdentityDataContext>(options =>
                options.UseSqlServer(Configuration
                    ["Data:Identity:ConnectionString"]));

            services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<IdentityDataContext>()
                .AddDefaultTokenProviders();

            services.AddDbContext<DataContext>(options =>options.UseSqlServer(Configuration["Data:Local:ConnectionString"]));
            services.AddScoped<Repository>();
            services.AddMvc();

            services.AddAuthentication(
                    CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options => {
                    options.Events.OnRedirectToLogin = context => {
                        if (context.Request.Path.StartsWithSegments("/api")
                                && context.Response.StatusCode == 200) {
                            context.Response.StatusCode = 401;
                        } else {
                            context.Response.Redirect(context.RedirectUri);
                        }
                        return Task.FromResult<object>(null);
                    };
                });  
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env,DataContext context,
        IdentityDataContext identityContext,UserManager<IdentityUser> userManager,RoleManager<IdentityRole> roleManager)
        {
            /*if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }*/
            
            app.UseDeveloperExceptionPage();
            app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                HotModuleReplacement = true
                });
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute("angular-fallback",new { controller = "Home", action = "Index" });
            });
            SeedData.SeedDatabase(context);
            IdentitySeedData.SeedDatabase(identityContext,userManager, roleManager).GetAwaiter().GetResult();
        }
    }
}
