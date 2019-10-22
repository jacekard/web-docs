using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebDocs.Logic;
using WebDocs.Models;

namespace WebDocs.Controllers
{
    [Route("api/documents")]
    public class DocumentsController : Controller
    {
        private string LoggedInUser => User.Identity.Name;

        private readonly IDocumentsProvider docsProvider;

        public DocumentsController(IDocumentsProvider docsProvider)
        {
            this.docsProvider = docsProvider;
        }

        [HttpGet]
        public IActionResult GetDocuments()
        {
            try
            {
                var documents = this.docsProvider.GetDocuments(this.LoggedInUser);

                return this.Ok(documents);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetDocument(long id)
        {
            try
            {
                var document = this.docsProvider.GetDocument(id);

                return this.Ok(document);
            }
            catch (Exception ex)
            {
                return this.NotFound(ex);
            }
        }
    }
}
