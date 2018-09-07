using Microsoft.EntityFrameworkCore;

namespace Sharp.Models
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions<DataContext> opts): base(opts) { }

        public DbSet<UserStore> UserStores{get;set;}
        public DbSet<Store> Stores{get;set;}

        public DbSet<Authorization> Authorizations{get;set;}
    }
}