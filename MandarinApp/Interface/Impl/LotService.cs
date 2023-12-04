using MandarinApp.Data;
using MandarinApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net.Mail;
using System.Net;

namespace MandarinApp.Interface.Impl
{
    public class LotService : ICRUD<Lot>
    {
        private readonly ApplicationDataContext _context;

        public LotService(ApplicationDataContext context)
        {
            _context = context;
        }

        public void Add(Lot newData)
        {
            _context.Lots.Add(newData);
            SaveChanges();
        }

        public void Change(int id, Lot newData)
        {
            _context.Entry(newData).State = EntityState.Modified;
            SaveChanges();
        }

        public void Delete(int id)
        {
            Lot lot = Get(id);
            _context.Lots.Remove(lot);
            SaveChanges();
        }

        //Вынести SMTP
        public async void DeleteBySheduller()
        {
            string lastBetEmail = "";
            var lotsToRemove = _context.Lots.Where(x => x.lotEndDate <= DateTime.Today);
            foreach (var lot in lotsToRemove)
            {
                var maxBet = _context.Bets.Where(x => x.lotId == lot.Id).ToList();
                var lastBet = maxBet.MaxBy(x => x.Price);
                lastBetEmail = lastBet.UserEmail;

                if (!lastBetEmail.IsNullOrEmpty())
                {
                    MailMessage message = new MailMessage();
                    message.IsBodyHtml = true;
                    message.From = new MailAddress("mandarin@auction.com", "Аукцион мандаринов");
                    message.To.Add(new MailAddress(lastBetEmail));
                    message.Subject = "Лот поставлен";
                    message.Body = $"Поздравляем! Ваша ставка на лот №{lot.Id} победила в аукционе!";

                    using (SmtpClient client = new SmtpClient("smtp.yandex.ru", 587))
                    {
                        //Логин и пароль
                        client.Credentials = new NetworkCredential("***@yandex.ru", "***");
                        client.EnableSsl = true;

                        client.Send(message);
                    }
                }

                lot.isOpen = false;
                Change(lot.Id, lot);
            }
            _context.SaveChanges();
        }

        public Lot Get(int id)
        {
            Lot? lot = _context.Lots.Find(id);
            if (lot == null)
                throw new NullReferenceException();
            return lot;
        }

        public ICollection<Lot> GetList()
        {
            return _context.Lots.ToList();
        }

        private void SaveChanges()
        {
            if (_context.SaveChanges() < 1)
                throw new DbUpdateException("Сохранение не удачно");
        }
    }
}