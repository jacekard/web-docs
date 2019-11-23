using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebDocs.Models;

namespace WebDocs.Logic
{
    public class SyncingService : ISyncingService
    {
        private IServiceScopeFactory serviceScopeFactory;
        private Dictionary<long, string> latestVersions { get; set; }

        private static readonly object sync = new object();

        public SyncingService(IServiceScopeFactory serviceScopeFactory)
        {
            this.serviceScopeFactory = serviceScopeFactory;
            this.latestVersions = new Dictionary<long, string>();
        }

        public void UpdateLatestVersion(long id, string guid)
        {

            if (!this.latestVersions.TryAdd(id, guid))
            {
                this.latestVersions[id] = guid;
            }
        }

        public bool CheckSync(Document document)
        {
            lock (sync)
            {
                if (!this.latestVersions.TryAdd(document.Id, document.LatestVersion))
                {
                    if (this.latestVersions[document.Id] == document.LatestVersion)
                    {
                        using (var scope = serviceScopeFactory.CreateScope())
                        {
                            var context = scope.ServiceProvider.GetService<IDocumentsProvider>();
                            context.SaveDocument(document);
                            return true;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    using (var scope = serviceScopeFactory.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetService<IDocumentsProvider>();
                        context.SaveDocument(document);
                        this.latestVersions[document.Id] = document.LatestVersion;
                        return true;
                    }
                }
            }
        }
    }
}
