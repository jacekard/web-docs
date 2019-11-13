using Microsoft.AspNetCore.SignalR;
using Serilog;
using System;
using System.Collections.Generic;
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

        public async Task SaveDocument(Document document)
        {
            if (document == null)
            {
                return;
            }

            mutex.WaitOne();
            try
            {
                await docsProvider.SaveDocument(document);
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }

        public async Task UpdateDocumentContent(Document document)
        {
            try
            {
                if (document == null)
                {
                    return;
                }

                var groupName = document.Id.ToString();
                await Clients.OthersInGroup(groupName).SendAsync("ReceiveDocumentContent", document.Content);
            }
            catch(Exception ex)
            {
                Log.Error(ex, "Error ocurred while updating document");
            }
        }

        public async Task AddToDocumentGroup(long documentId)
        {
            var groupName = documentId.ToString();

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.OthersInGroup(groupName).SendAsync("EditorAdded");
        }

        public async Task RemoveFromDocumentGroup(long documentId)
        {
            var groupName = documentId.ToString();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.OthersInGroup(groupName).SendAsync("EditorRemoved");
        }

        public async Task Draw(DrawingData data)
        {
            await Clients.Others.SendAsync("DrawFromHub", data);
        }

        public async Task AddToDrawingGroup(string drawingId)
        {
            var groupName = drawingId;
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.OthersInGroup(groupName).SendAsync("EditorAdded");
        }

        public async Task RemoveFromDrawingGroup(string drawingId)
        {
            var groupName = drawingId;
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.OthersInGroup(groupName).SendAsync("EditorRemoved");
        }

        public async Task SendDrawingContext(string drawingId, object imageUrl)
        {
            var groupName = drawingId;

            await Clients.OthersInGroup(groupName).SendAsync("ContextFromHub", imageUrl);
        }

        public async Task EraseDrawing(string drawingId)
        {
            var groupName = drawingId;

            await Clients.OthersInGroup(groupName).SendAsync("EraseDrawing");
        }
    }
}
