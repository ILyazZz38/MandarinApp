using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MandarinApp.Data;
using MandarinApp.Models;
using System.Net.Mail;
using System.Net;
using Microsoft.IdentityModel.Tokens;

namespace MandarinApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BetsController : ControllerBase
    {
        private readonly ApplicationDataContext _context;

        public BetsController(ApplicationDataContext context)
        {
            _context = context;
        }

        // GET: api/Bets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bet>>> GetBets()
        {
          if (_context.Bets == null)
          {
              return NotFound();
          }
            return await _context.Bets.Include(c => c.lot).ToListAsync();
        }

        // GET: api/Bets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bet>> GetBet(int id)
        {
          if (_context.Bets == null)
          {
              return NotFound();
          }
            var bet = await _context.Bets.FindAsync(id);

            if (bet == null)
            {
                return NotFound();
            }

            return bet;
        }

        // PUT: api/Bets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBet(int id, Bet bet)
        {
            if (id != bet.Id)
            {
                return BadRequest();
            }

            _context.Entry(bet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BetExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        //TODO: Вынести SMTP
        // POST: api/Bets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Bet>> PostBet(Bet bet)
        {
            if (_context.Bets == null || _context.Lots == null || _context.Mandarins == null)
            {
                return Problem("Entity set 'ApplicationDataContext'  is null.");
            }

            var lot = _context.Lots.Where(x => x.Id == bet.lotId).FirstOrDefault();
            if (!lot.isOpen)
            {
                return Problem("Lot closed.");
            }

            string lastBetEmail = "";
            var allBets = _context.Bets.Where(x => x.lotId == bet.lotId).ToList();

            if (allBets.Count == 0)
            {
                var mandarinId = _context.Lots.Where(x => x.Id == bet.lotId).FirstAsync().Result.mandarinId;
                if (_context.Mandarins.Where(x => x.Id == mandarinId).FirstAsync().Result.StartPrice > bet.Price)
                {
                    return Problem("Price to small.");
                }
            }
            else
            {
                if (allBets.Where(x => x.Price >= bet.Price).ToList().Count != 0)
                {
                    return Problem("Price to small.");
                }
                var maxBet = _context.Bets.Where(x => x.lotId == bet.lotId).ToList();
                var lastBet = maxBet.MaxBy(x => x.Price);
                lastBetEmail = lastBet.UserEmail;
            }
            
            _context.Bets.Add(bet);
            await _context.SaveChangesAsync();

            MailMessage message = new MailMessage();
            message.IsBodyHtml = true;
            message.From = new MailAddress("mandarin@auction.com", "Аукцион мандаринов");
            message.To.Add(new MailAddress(bet.UserEmail));
            message.Subject = "Лот поставлен";
            message.Body = $"Вы поставили ставку на лот №{bet.lotId}";

            using (SmtpClient client = new SmtpClient("smtp.yandex.ru",587))
            {
                //Логин и пароль
                client.Credentials = new NetworkCredential("***@yandex.ru", "***");
                client.EnableSsl = true;

                client.Send(message);
            }

            if (!lastBetEmail.IsNullOrEmpty())
            {
                message.To.Add(new MailAddress(lastBetEmail));
                message.Subject = "Лот перебит";
                message.Body = $"Другой пользователь перебил Вашу ставку на лот №{bet.lotId}";

                using (SmtpClient client = new SmtpClient("smtp.yandex.ru", 587))
                {
                    //Логин и пароль
                    client.Credentials = new NetworkCredential("***@yandex.ru", "***");
                    client.EnableSsl = true;

                    client.Send(message);
                } 
            }

            return CreatedAtAction("GetBet", new { id = bet.Id }, bet);
        }

        // DELETE: api/Bets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBet(int id)
        {
            if (_context.Bets == null)
            {
                return NotFound();
            }
            var bet = await _context.Bets.FindAsync(id);
            if (bet == null)
            {
                return NotFound();
            }

            _context.Bets.Remove(bet);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BetExists(int id)
        {
            return (_context.Bets?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
