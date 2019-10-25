using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Models;

namespace WebDocs.Logic
{
    public interface IDocumentsProvider
    {
        List<RestDocument> GetDocuments(string userId);

        Task<Document> GetDocument(long docId);

        Task SaveDocument(Document document);

        Task DeleteDocument(Document document);
    }
}
