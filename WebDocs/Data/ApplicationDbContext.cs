using WebDocs.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace WebDocs.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DbSet<Document> Documents { get; set; }
        public DbSet<UserDocument> UserDocuments { get; set; }

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
             
            builder.Entity<UserDocument>().HasKey(ud => new { ud.ApplicationUserId, ud.DocumentId });


            //builder.Entity<UserDocument>()
            //    .HasOne(ud => ud.ApplicationUser)
            //    .WithMany(u => u.UserDocuments)
            //    //.HasForeignKey(ud => ud.ApplicationUserId);
            //builder.Entity<UserDocument>()
            //    .HasOne(ud => ud.Document)
            //    .WithMany(d => d.UserDocuments)
            //    .HasForeignKey(ud => ud.DocumentId);
        }
    }
}
