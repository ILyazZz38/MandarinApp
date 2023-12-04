using Quartz.Impl;
using Quartz;
using System.Net.Mail;
using System.Net;
using MandarinApp.Models;
using MandarinApp.Controllers;
using MandarinApp.Data;
using Microsoft.EntityFrameworkCore;
using MandarinApp.Interface;
using System.Numerics;

namespace MandarinApp.Jobs
{
    public class DeleteMandarin : IJob
    {
        private readonly ICRUD<Mandarin> cMandarin;
        public DeleteMandarin(ICRUD<Mandarin> CMandarin)
        {
            cMandarin = CMandarin;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            cMandarin.DeleteBySheduller();
        }
    }
}
