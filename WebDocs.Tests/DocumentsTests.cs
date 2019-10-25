using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using WebDocs.Data;
using WebDocs.Logic;
using WebDocs.Models;

namespace WebDocs.Tests
{
    [TestFixture]
    public class DocumentsTests
    {
        private ApplicationDbContext dbContext;
        private IDocumentsProvider docsProvider;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "DocumentsTests").Options;

            var storeOptions = new Mock<IOptions<OperationalStoreOptions>>();
            this.dbContext = new ApplicationDbContext(options, storeOptions.Object);

            var user = new ApplicationUser() { Id = "1", Email = "test@user.com" };
            this.dbContext.Users.Add(user);
            this.dbContext.SaveChanges();

            this.docsProvider = new DocumentsProvider(this.dbContext);
        }

        [OneTimeTearDown]
        public void Dispose()
        {
            this.dbContext.Dispose();
        }

        [Test]
        public void Should_GetDocument_WhenAddedToDbContext()
        {
            // arrange
            var document = new Document() { Content = "<p>this is test content</p>", UserId = "1" };

            // act
            this.docsProvider.SaveDocument(document);
            var documentById = this.docsProvider.GetDocument(1);
            var documentCount = this.docsProvider.GetDocuments(document.UserId).Count;

            // assert
            Assert.IsNotNull(documentById);
            Assert.Equals(documentCount, 1);
        }
    }
}