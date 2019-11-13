using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebDocs.Models
{
    public class Drawing
    {
        public int DrawingId { get; set; }

        public string UserId { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.Now;

        public DateTime LastModifiedDate { get; set; } = DateTime.Now;
    }
}
