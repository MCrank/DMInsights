using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMInsights.Data;
using DMInsights.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DMInsights
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
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.IncludeErrorDetails = true;
                    options.Authority = "https://dev-531773.okta.com/oauth2/default";
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = "https://dev-531773.okta.com/oauth2/default",
                        ValidateAudience = true,
                        ValidAudience = "api://default",
                        ValidateLifetime = true
                    };
                });

            services.AddCors(Action =>
            {
                Action.AddPolicy("SignalRCORS", Builder =>
                {
                    Builder.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:3000");
                });
            });

            services.AddSignalR();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.Configure<DBConfiguration>(Configuration);
            services.AddTransient<UsersRepository>();
            services.AddTransient<PlayerCharactersRepository>();
            services.AddTransient<NonPlayerCharactersRepository>();
            services.AddTransient<CampaignsRepository>();
            services.AddTransient<CampaignsUsersRepository>();

            services.AddSingleton<IConfiguration>(Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseCors("SignalRCORS");
            app.UseSignalR(Configuration =>
            {
                Configuration.MapHub<Battle>("/battles");
            });
            app.UseMvc();
        }
    }
}
