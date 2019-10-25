using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace WebDocs.Models
{
    public class Document
    {
        public long Id { get; set; }

        [NotMapped]
        public string UserId { get; set; }

        public string Name { get; set; }

        public string Content { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.Now;

        public DateTime LastModifiedDate { get; set; } = DateTime.Now;

        public int Hash => GetHashCode();

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, CreationDate, Content);
        }
    }
}
