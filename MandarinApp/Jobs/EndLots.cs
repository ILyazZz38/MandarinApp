using MandarinApp.Interface;
using MandarinApp.Models;
using Quartz;
using System.Numerics;

namespace MandarinApp.Jobs
{
    public class EndLots : IJob
    {
        private readonly ICRUD<Lot> cLot;
        public EndLots(ICRUD<Lot> CLot)
        {
            cLot = CLot;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            cLot.DeleteBySheduller();
        }
    }
}
