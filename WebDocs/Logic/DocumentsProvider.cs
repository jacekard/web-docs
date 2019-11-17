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
        }

        public List<RestDocument> GetDocuments(string userId)
        {
            var user = this.dbContext.Users
                .Include(x => x.UserDocuments)
                .ThenInclude(x => x.Document)
                .Single(x => x.Id == userId);

            return user.UserDocuments.Select(x => new RestDocument()
            {
                Id = x.Document.Id,
                Name = x.Document.Name,
                LastModifiedDate = x.Document.LastModifiedDate
            }).ToList();
        }

        public async Task<Document> GetDocument(string userId, long docId)
        {
            var document = await this.dbContext.Documents.FirstOrDefaultAsync(x => x.Id == docId);
            var user = await this.dbContext.Users.Include(x => x.UserDocuments).FirstOrDefaultAsync(x => x.Id == userId);

            if (document == null)
            {
                document = new Document();
                this.dbContext.Documents.Add(document);
                await this.dbContext.SaveChangesAsync();
            }

            if (!user.UserDocuments.Any(x => x.DocumentId == document.Id))
            {
                user.UserDocuments.Add(new UserDocument()
                {
                    DocumentId = document.Id,
                    Document = document,
                    ApplicationUser = user,
                    ApplicationUserId = user.Id
                });

                await this.dbContext.SaveChangesAsync();
            }

            return document;
        }

        public async Task DeleteDocument(string userId, long docId)
        {
            try
            {
                var ud = await this.dbContext.UserDocuments.SingleOrDefaultAsync(x => x.ApplicationUserId == userId && x.DocumentId == docId);
                this.dbContext.UserDocuments.Remove(ud);
            }
            catch (InvalidOperationException ex)
            {
                Log.Error("Error ocurred in delete document. UserDocuments contains more than one record.");
            }

            await this.dbContext.SaveChangesAsync();
        }

        public void SaveDocument(Document document)
        {
            try
            {
                document.LastModifiedDate = DateTime.Now;

                var entity = this.dbContext.Documents.Find(document.Id);

                this.dbContext.Entry(entity).CurrentValues.SetValues(document);

                this.dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occured while saving document");
            }
        }

    }
}
