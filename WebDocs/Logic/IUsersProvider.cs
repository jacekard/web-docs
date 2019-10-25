using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Models;

namespace WebDocs.Logic
{
    public interface IUsersProvider
    {
        ApplicationUser GetUser(string id);
    }
}
