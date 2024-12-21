using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Infrastructure.Extension;
using DeploymentAnalyzer.Server.Filters;
using DeploymentAnalyzer.Server.Schedulers.Interface;
using DeploymentAnalyzer.Server.Schedulers.Service;
using DeploymentAnalyzer.Utility.Common;
using Hangfire;
using Hangfire.SqlServer;
using log4net.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

XmlConfigurator.Configure(new FileInfo("log4net.config"));

var jwtSettings = new JwtSettings();
builder.Configuration.GetSection("JwtSettings").Bind(jwtSettings);
builder.Services.AddSingleton(jwtSettings);

var azureAdSettingsSection = builder.Configuration.GetSection("AzureAdSettings");
builder.Services.Configure<AzureAdSettings>(azureAdSettingsSection);

var AzureAdB2CSection = builder.Configuration.GetSection("AzureAdB2C");
builder.Services.Configure<AzureAdB2CSettings>(AzureAdB2CSection);

var AzureEmailSettingsSection = builder.Configuration.GetSection("AzureEmailSettings");
builder.Services.Configure<AzureEmailSettings>(AzureEmailSettingsSection);

var licenseMailSettingsSection = builder.Configuration.GetSection("LicenseMailSettings");
builder.Services.Configure<LicenseMailSetting>(licenseMailSettingsSection);

builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(builder.Configuration.GetConnectionString("DBConnection")));

builder.Services.AddHangfireServer();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".DeploymentAnalyzer.Session";
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.IsEssential = true;
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200",
                "https://deploymentanalyzer-dev.azurewebsites.net",
                "https://deploymentanalyzer-test.azurewebsites.net",
                "https://deploymentanalyzer-accept.azurewebsites.net",
                "https://deploymentanalyzer.azurewebsites.net",
                "https://da20.azurewebsites.net") // Specify the URL of your Angular app
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();
        });
});

builder.Services.RegisterServices();

builder.Services.AddSignalR();

builder.Services.AddControllers();

var key = Encoding.ASCII.GetBytes(jwtSettings.Secret);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Deployment Analyzer API", Version = "v1" });

    // Define the BearerAuth scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter into field the word 'Bearer' followed by a space and the JWT value.",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
});



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHangfireDashboard();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();


app.UseRouting();

app.UseSession();

app.UseCors("AllowSpecificOrigin");


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<NotificationHub>("/notificationHub");
});
app.MapFallbackToFile("/index.html");

//RecurringJob.AddOrUpdate<BackgroundJobService>("Quarter Job", service => service.AddRecord(), "0 0 * */3 *");

app.Run();
