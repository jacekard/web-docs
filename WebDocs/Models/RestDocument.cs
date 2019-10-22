using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebDocs.Models
{
    public class RestDocument
    {
        public long Id { get; set; }
        public string Name { get; set; }

        public DateTime LastModifiedDate { get; set; }
    }
}
