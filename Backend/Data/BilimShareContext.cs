using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BilimShare.Models;
using Microsoft.Extensions.Hosting;
using System.Reflection.Metadata;

namespace BilimShare.Data
{
    public class BilimShareUser : IdentityUser<int>
    {
        //public string? DisplayName { get; set; }
        public string? Occupation { get; set; }
        public string? Role { get; set; }
        public string? AvatarPath { get; set; }
        public string? AboutMe { get; set; }
    }
    public class BilimShareRole : IdentityRole<int> { }
    public class BilimShareDbContext : IdentityDbContext<BilimShareUser, IdentityRole<int>, int>
    {
        public BilimShareDbContext(DbContextOptions<BilimShareDbContext> options)
            : base(options)
        {
        }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<BilimShareUser>()
                .Property(e => e.Occupation)
                .HasMaxLength(50);

            modelBuilder.Entity<BilimShareUser>()
                .Property(e => e.AboutMe)
                .HasMaxLength(500);
        
        }
    }
}
