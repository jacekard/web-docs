using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Data;
using WebDocs.Models;

namespace WebDocs.Logic
{
    public class UsersProvider : IUsersProvider
    {
        private readonly ApplicationDbContext dbContext;

        public UsersProvider(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public ApplicationUser GetUser(string id)
        {
            return this.dbContext.Users.SingleOrDefault(user => user.Id == id);
        }
    }
}
