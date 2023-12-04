using Quartz;
using MandarinApp.Models;
using MandarinApp.Interface;

namespace MandarinApp.Jobs
{
    public class CreateMandarin: IJob
    {
        private readonly ICRUD<Mandarin> cMandarin;
        public CreateMandarin(ICRUD<Mandarin> CMandarin)
        {
            cMandarin = CMandarin;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            //Вынести страны, но можно и просто убрать
            string[] mandarinNames = { "Марокканский", "Турецкий", "Испанский", "Китайский",
                            "Греческий", "Алжирский", "Грузинский", "Абхазский"};

            Mandarin mandarin = new Mandarin() { Name = mandarinNames[new Random().Next(mandarinNames.Length)], StartPrice = new Random().Next(10, 100) };
            cMandarin.Add(mandarin);
        }
    }
}
