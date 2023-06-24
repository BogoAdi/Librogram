/*using Librogram.Application.Books.CommandHandlers;
using Librogram.Application.Books.Commands;
using Librogram.Application.Exceptions;
using Librogram.Dal;
using Librogram.Domain;
using System.Net;

namespace Librogram.IntegrationTests
{
    public class CreateBookUnitTests
    {
        private readonly LibrogramContext _context;
        private readonly CreateBookCommandHandler _handler;

        public CreateBookUnitTests()
        {
            _context = InMemoryDbContext.GetInMemoryDbContext();
            _handler = new CreateBookCommandHandler(_context);
        }
        [Fact]
        public async Task Handle_ExistingBook_ByBeingCreated()
        {
            // Arrange
            _context.IntializeDbForTests();
            var createBookCommand = new CreateBookCommand
            {
                Book =
              new Book
              {
                  Author = "J. R. R. Tolkien",
                  Category = "fantasy", 
                  Title = "Lord of the Rings",
                  LibraryId = Guid.NewGuid(),
                  PdfFormat = false

              }
            };
            // Act & Assert
            var exception = await Assert.ThrowsAsync<HttpResponseException>(() => _handler.Handle(createBookCommand, CancellationToken.None));
            Assert.Equal(HttpStatusCode.BadRequest, exception.StatusCode);
        }

    }
}
*/