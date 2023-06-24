using Azure.Storage.Blobs;
using Librogram.Application.Exceptions;
using Librogram.Application.Libraries.Commands;
using Librogram.Application.utils;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models.ExternalConnectors;
using System.Net;
using System.Runtime.CompilerServices;

namespace Librogram.Application.Libraries.CommandHandlers
{
    public class RemoveBookFromLibraryCommandHandler : IRequestHandler<RemoveBookFromLibraryCommand, LibraryBooksDetails>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public RemoveBookFromLibraryCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }

        public async Task<LibraryBooksDetails> Handle(RemoveBookFromLibraryCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Libraries.Include(x => x.Books).FirstOrDefaultAsync(x => x.Id == request.Id);
            var bookFound = await _context.Books.FirstOrDefaultAsync(x =>x.UniqueBookId == request.BookId);
            if (isValid(found,bookFound,request))
            {

                var blobClient1 = _blobContainer.GetBlobClient(Path.GetFileName(bookFound.Picture));
                await blobClient1.DeleteIfExistsAsync();
                found.Books.Remove(bookFound);
                bookFound.LibraryId = Guid.Empty;
                _context.Books.Remove(bookFound);
                /*found.NumberOfBooks--;*/
            }
            await _context.SaveChangesAsync();
            List<Library> result = new List<Library>();
            result.Add(found);

            return LibraryBooksDetailsUtil.GetLibraryDetails(result).First();
        }
        public bool isValid(Library? library, Book? book, RemoveBookFromLibraryCommand request)
        {
            if (library is null) throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "No library with that id was found");
            if (book is null) throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "No book with that Id was found");
            if (library.OwnerId == request.UserId)
                throw new HttpResponseException(HttpStatusCode.Forbidden,
                    "You can't remove books unless you are the owner of the library");
            return true;
        }
    }
}
