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
        private readonly ISyncingService syncService;

        public DocHub(ISyncingService syncService)
        {
            this.syncService = syncService;
        }

        //public void SaveDocument(Document document)
        //{
        //    if (document == null)
        //    {
        //        return;
        //    }

        //    lock (syncLock)
        //    {
        //        docsProvider.SaveDocument(document);
        //    }
        //}

        public async Task UpdateDocumentContent(Document document)
        {
            if (document == null)
            {
                return;
            }

            var groupName = document.Id.ToString();
            this.syncService.UpdateLatestVersion(document.Id, document.LatestVersion);
            await Clients.OthersInGroup(groupName).SendAsync("ReceiveDocumentContent", document.Content, document.LatestVersion);
        }

        public async Task AddToDocumentGroup(long documentId)
        {
            var groupName = documentId.ToString();

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("EditorAdded");
        }

        public async Task RemoveFromDocumentGroup(long documentId)
        {
            var groupName = documentId.ToString();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("EditorRemoved");
        }

        public async Task Draw(string drawingId, DrawingData data)
        {
            var groupName = drawingId;

            await Clients.OthersInGroup(groupName).SendAsync("DrawFromHub", data);
        }

        public async Task AddToDrawingGroup(string drawingId)
        {
            var groupName = drawingId;
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("EditorAdded");
        }

        public async Task RemoveFromDrawingGroup(string drawingId)
        {
            var groupName = drawingId;
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("EditorRemoved");
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
