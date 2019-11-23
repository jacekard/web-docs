using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace WebDocs.Models
{
    public class Document
    {
        public long Id { get; set; }

        public virtual ICollection<UserDocument> UserDocuments { get; set; }

        public string Name { get; set; }
        
        public string Content { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.Now;

        public DateTime LastModifiedDate { get; set; } = DateTime.Now;

        public string LatestVersion { get; set; }
    }

    public class UserDocument
    {
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public long DocumentId { get; set; }
        public Document Document { get; set; }
    }
}
