using MandarinApp.Data;
using MandarinApp.Interface;
using MandarinApp.Interface.Impl;
using MandarinApp.Jobs;
using MandarinApp.Models;
using Microsoft.EntityFrameworkCore;
using Quartz;
using System.Numerics;

var builder = WebApplication.CreateBuilder(args);

string connection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDataContext>(options => options.UseNpgsql(connection));
builder.Services.AddScoped<ICRUD<Mandarin>, MandarinService>();

var addJobKey = new JobKey("MandarinCreate");
builder.Services.AddQuartz(q => { q.UseMicrosoftDependencyInjectionJobFactory(); q.AddJob<CreateMandarin>(x =>
{
    x.WithIdentity(addJobKey);
});
    q.AddTrigger(c => c.ForJob(addJobKey).WithIdentity("MandarinCreate").WithCronSchedule("0 0 * ? * *"));
}) ;

var deleteJobKey = new JobKey("MandarinDrop");
builder.Services.AddQuartz(q => {
    q.UseMicrosoftDependencyInjectionJobFactory(); q.AddJob<DeleteMandarin>(x =>
    {
        x.WithIdentity(deleteJobKey);
    });
    q.AddTrigger(c => c.ForJob(deleteJobKey).WithIdentity("MandarinDrop").WithCronSchedule("0 0 0 * * ?"));
});

var closeLotKey = new JobKey("LotClose");
builder.Services.AddQuartz(q => {
    q.UseMicrosoftDependencyInjectionJobFactory(); q.AddJob<EndLots>(x =>
    {
        x.WithIdentity(closeLotKey);
    });
    q.AddTrigger(c => c.ForJob(closeLotKey).WithIdentity("LotClose").WithCronSchedule("0 0 0 * * ?"));
});

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
.AllowAnyOrigin()
.AllowAnyMethod()
.AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//CreateMandarin.Start();

app.Run();
