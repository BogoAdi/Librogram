using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Librogram.Application.Books.Commands;
using Librogram.Application.Exceptions;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models.ExternalConnectors;
using System.Net;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Librogram.Application.Books.CommandHandlers
{
    public class CreateBookCommandHandler : IRequestHandler<CreateBookCommand, Book>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public CreateBookCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }
        public async Task<Book> Handle(CreateBookCommand request, CancellationToken cancellationToken)
        {
            if (request.File == null) throw new HttpResponseException(HttpStatusCode.BadRequest, "empty command sent");

            var fileName = Guid.NewGuid().ToString();
            var blobClient = _blobContainer.GetBlobClient(fileName);
            var headers = new BlobHttpHeaders();
            headers.ContentType = request.File.ContentType;
            using (var fileStream = request.File.OpenReadStream())
            {
                await blobClient.UploadAsync(fileStream, headers, conditions: null, cancellationToken: CancellationToken.None);
            }
            var book = new Book
            { 
                Author = request.Book.Author,
                LibraryId = request.Book.LibraryId,
                Category = request.Book.Category,
                Status = StatusValues.Available,
                PdfFormat = request.Book.PdfFormat,
                UniqueBookId = Guid.NewGuid(),
                Description = request.Book.Description,
                Picture = blobClient.Uri.ToString(),
                Title = request.Book.Title,
                Borrowings= request.Book.Borrowings
            };
            if (areAllFieldsCompleted(book))
                _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return book;
        }

        private bool areAllFieldsCompleted(Book book)
        {
            if (book.Title == null || book.Author == null || book.Category == null || book.Description == null || book.Picture == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "All fields must be completed");
            return true;
        }
    }
}
