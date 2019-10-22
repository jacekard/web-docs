using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Models;

namespace WebDocs.Logic
{
    public interface IDocumentsProvider
    {
        List<RestDocument> GetDocuments(string username);

        Document GetDocument(long id);

        Task SaveDocument(string username, Document document);

        void DeleteDocument(string username, Document document);
    }
}
