using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Data;
using WebDocs.Models;

namespace WebDocs.Logic
{
    public class DocumentsProvider : IDocumentsProvider
    {
        private readonly ApplicationDbContext dbContext;

        public DocumentsProvider(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public List<RestDocument> GetDocuments(string username)
        {
            var user = this.dbContext.Users.Single(x => x.Email == username);

            return user.Documents.Select(x => new RestDocument()
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
        }

        public Document GetDocument(long id)
        {
            return this.dbContext.Documents.Where(x => x.Id == id).FirstOrDefault();
        }

        public void DeleteDocument(string username, Document document)
        {
            this.dbContext.Users.Single(x => x.Email == username).Documents.Remove(document);
            this.dbContext.Documents.Remove(document);
        }

        public async Task SaveDocument(string username, Document document)
        {
            document.LastModifiedDate = DateTime.Now;
            
            if (!this.dbContext.Documents.Contains(document))
            {
                document.CreationDate = DateTime.Now;
                await this.dbContext.Documents.AddAsync(document);
            }
            else
            {
                this.dbContext.Documents.Attach(document);
            }

            await this.dbContext.SaveChangesAsync();
        }
    }
}
