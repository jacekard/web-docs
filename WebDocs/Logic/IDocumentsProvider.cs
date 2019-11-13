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

        Task<Document> GetDocument(string userId, long docId);

        void SaveDocument(Document document);

        Task DeleteDocument(string userId, long docId);
    }
}
