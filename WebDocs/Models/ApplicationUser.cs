﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebDocs.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<Document> Documents { get; set; }
    }
}