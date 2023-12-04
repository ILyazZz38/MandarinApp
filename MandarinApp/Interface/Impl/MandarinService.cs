using MandarinApp.Data;
using MandarinApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace MandarinApp.Interface.Impl
{
    public class MandarinService : ICRUD<Mandarin>
    {
        private readonly ApplicationDataContext _context;

        public MandarinService(ApplicationDataContext context)
        {
            _context = context;
        }

        public void Add(Mandarin newData)
        {
            _context.Mandarins.Add(newData);
            SaveChanges();
        }

        public void Change(int id, Mandarin newData)
        {
            _context.Entry(newData).State = EntityState.Modified;
            SaveChanges();
        }

        public void Delete(int id)
        {
            Mandarin mandarin = Get(id);
            _context.Mandarins.Remove(mandarin);
            SaveChanges();
        }

        public async void DeleteBySheduller()
        {
            var mandarinsToRemove = _context.Mandarins.Where(x => x.DateAdd <= DateTime.Today);
            _context.Mandarins.RemoveRange(mandarinsToRemove);
            _context.SaveChanges();
        }

        public Mandarin Get(int id)
        {
            Mandarin? mandarin = _context.Mandarins.Find(id);
            if (mandarin == null)
                throw new NullReferenceException();
            return mandarin;
        }

        public ICollection<Mandarin> GetList()
        {
            return _context.Mandarins.ToList();
        }

        private void SaveChanges()
        {
            if (_context.SaveChanges() < 1)
                throw new DbUpdateException("Сохранение не удачно");
        }
    }
}