using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MandarinApp.Data;
using MandarinApp.Models;

namespace MandarinApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MandarinsController : ControllerBase
    {
        private readonly ApplicationDataContext _context;

        public MandarinsController(ApplicationDataContext context)
        {
            _context = context;
        }

        // GET: api/Mandarins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mandarin>>> GetMandarins()
        {
          if (_context.Mandarins == null)
          {
              return NotFound();
          }
            return await _context.Mandarins.ToListAsync();
        }

        // GET: api/Mandarins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mandarin>> GetMandarin(int id)
        {
          if (_context.Mandarins == null)
          {
              return NotFound();
          }
            var mandarin = await _context.Mandarins.FindAsync(id);

            if (mandarin == null)
            {
                return NotFound();
            }

            return mandarin;
        }

        // PUT: api/Mandarins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMandarin(int id, Mandarin mandarin)
        {
            if (id != mandarin.Id)
            {
                return BadRequest();
            }

            _context.Entry(mandarin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MandarinExists(id))
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

        // POST: api/Mandarins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Mandarin>> PostMandarin(Mandarin mandarin)
        {
          if (_context.Mandarins == null)
          {
              return Problem("Entity set 'ApplicationDataContext.Mandarins'  is null.");
          }
            _context.Mandarins.Add(mandarin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMandarin", new { id = mandarin.Id }, mandarin);
        }

        // DELETE: api/Mandarins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMandarin(int id)
        {
            if (_context.Mandarins == null)
            {
                return NotFound();
            }
            var mandarin = await _context.Mandarins.FindAsync(id);
            if (mandarin == null)
            {
                return NotFound();
            }

            _context.Mandarins.Remove(mandarin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MandarinExists(int id)
        {
            return (_context.Mandarins?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
