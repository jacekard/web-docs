using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Data;
using WebDocs.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace WebDocs.Logic
{
    public class DocumentsProvider : IDocumentsProvider
    {
        private readonly ApplicationDbContext dbContext;

        public DocumentsProvider(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
            Log.Information("Working!");
        }

        public List<RestDocument> GetDocuments(string userId)
        {
            var user = this.dbContext.Users.Single(x => x.Id == userId);

            if (user.Documents == null)
            {
                return null;
            }
            else
            {
                return user.Documents.Select(x => new RestDocument()
                {
                    Id = x.Id,
                    Name = x.Name,
                    LastModifiedDate = x.LastModifiedDate
                }).ToList();
            }
        }

        public async Task<Document> GetDocument(long docId)
        {
            var document = await this.dbContext.Documents.FirstOrDefaultAsync(x => x.Id == docId);

            return document ?? new Document();
        }

        public async Task DeleteDocument(Document document)
        {
            this.dbContext.Users.Single(x => x.Id == document.UserId).Documents.Remove(document);
            await this.dbContext.SaveChangesAsync();
        }

        public async Task SaveDocument(Document document)
        {
            document.LastModifiedDate = DateTime.Now;

            var entity = this.dbContext.Documents.Find(document.Id);
            if (entity == null)
            {
                try
                {
                    await this.dbContext.Documents.AddAsync(document);
                    var user = await this.dbContext.Users.FindAsync(document.UserId);
                    user.Documents.Add(document);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }
            else
            {
                this.dbContext.Entry(entity).CurrentValues.SetValues(document);
            }

            await this.dbContext.SaveChangesAsync();
        }
    }
}
