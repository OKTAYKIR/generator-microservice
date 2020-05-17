using System;
using Serilog;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Swashbuckle.AspNetCore.Swagger;
using JsonApiDotNetCore.Extensions;
using JsonApiDotNetCore.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using <%= projectName %>.Filters;
using <%= projectName %>.Services;

namespace <%= projectName %>
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        private ILoggerFactory LoggerFactory { get; set; }

        public Startup(IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            var loggerConfiguration = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .Enrich.With(new RequestResponseLogEnricher())
              .MinimumLevel.Debug();

            try
            {
                Log.Logger = loggerConfiguration
                    .WriteTo.MongoDB(Configuration["Connection:MongoDb:ConnectionString"])
                    .CreateLogger();
            }
            catch (Exception e)
            {
                Log.Logger = loggerConfiguration
                            .WriteTo.RollingFile("Logs/log-{Date}.log")
                            .CreateLogger();

                Log.Error(e, "InitLogger");
            }

            LoggerFactory = loggerFactory;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            IMvcBuilder mvcBuilder = services.AddMvc();
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info {Title = "<%= microserviceDescription %> API Documentation", Version = "v1"});
                c.OperationFilter<ContentTypeOperationFilter>();
                c.OperationFilter<AddAuthTokenHeaderParameter>();
            });

            services.AddJsonApi(opt =>
            {
                opt.AllowClientGeneratedIds = true;
                opt.BuildContextGraph(builder => 
                {
                    builder.AddResource<<%= requestModelName %>>("<%= requestModelName %>");
                    builder.AddResource<<%= responseModelName %>>("<%= responseModelName %>");
                });
            }, mvcBuilder);

            //TODO:
            mvcBuilder.AddMvcOptions(o => { o.Filters.Add(new GlobalExceptionFilter(LoggerFactory)); });

            services.AddSingleton<IConfiguration>(Configuration);

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<IDeleteService<<%= requestModelName %>, string>, <%= microserviceKey %>Service>();
          
            services.AddScoped<ICreateService<<%= requestModelName %>, <%= responseModelName %>, string>, <%= microserviceKey %>Service>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddSerilog();

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));

            loggerFactory.AddDebug();

            app.UseRequestAndResponseLogging();

            app.UseMvc();

            app.UseSwagger();

            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "<%= microserviceDescription %> API v.1.0.0"); });
        }
    }
}