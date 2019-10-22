using System;
using System.Collections.Generic;
using System.Text;

namespace WebDocs.Models
{
    public class Document
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string Content { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime LastModifiedDate { get; set; }

        public int Hash => GetHashCode();

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, CreationDate, Content);
        }
    }
}
