using MandarinApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MandarinApp.Data
{
    public class ApplicationDataContext : DbContext
    {
        public ApplicationDataContext(DbContextOptions<ApplicationDataContext> options) : base(options)
        {
            //Database.EnsureCreated();
        }
        public virtual DbSet<Mandarin> Mandarins { get; set; } = null!;
        public virtual DbSet<Bet> Bets { get; set; } = null!;
        public virtual DbSet<Lot> Lots { get; set; } = null!;
    }
}
