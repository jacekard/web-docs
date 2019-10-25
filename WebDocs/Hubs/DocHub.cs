using Microsoft.AspNetCore.SignalR;
using Serilog;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebDocs.Logic;
using WebDocs.Models;

namespace WebDocs.Hubs
{
    public class DocHub : Hub
    {
        private readonly IDocumentsProvider docsProvider;

        private readonly Mutex mutex = new Mutex();

        public DocHub(IDocumentsProvider docsProvider)
        {
            this.docsProvider = docsProvider;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message).ConfigureAwait(false);
        }

        public async Task UpdateDocumentContent(Document document)
        {
            if (document == null)
            {
                return;
            }

            await Clients.Others.SendAsync("ReceiaveDocumentContent", document.Content);

            this.mutex.WaitOne();
            try
            {
                await docsProvider.SaveDocument(document);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "UpdateDocumentContent in DocHub threw an exception while saving document.");
            }
            finally
            {
                this.mutex.ReleaseMutex();
            }
        }

        public async Task PingCursorPosition(Cursor cursor)
        {
            await Clients.Others.SendAsync("UpdateCursorPosition", cursor);
        }
    }
}
