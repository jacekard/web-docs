using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Models;

namespace WebDocs.Hubs
{
    public class DocHub : Hub
    {
        private readonly string DivClosingTag = "</div>";
        private readonly string DocumentTemplate 
            = "<div _ngcontent-ng-cli-universal-c2=\"\" class=\"page ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-focused\" id=\"editor\" lang=\"en\" dir=\"ltr\" role=\"textbox\" aria-label=\"Rich Text Editor, main\" contenteditable=\"true\">";

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task DocsModified(string user, string message)
        {
            await Clients.Others.SendAsync("ReceiveMessage", user, message);
        }

        public async Task UpdateDocumentContent(string content)
        {
            await Clients.Others.SendAsync("ReceiveDocumentContent", content);
        }

        public async Task PingCursorPosition(Cursor cursor)
        {
            await Clients.Others.SendAsync("UpdateCursorPosition", cursor);
        }
    }
}
