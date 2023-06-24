using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Librogram.Application.Exceptions;
using Librogram.Application.Libraries.Commands;
using Librogram.Application.utils;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models.ExternalConnectors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.CommandHandlers
{
    public class AddBookToLibraryCommandHandler : IRequestHandler<AddBookToLibraryCommand, LibraryBooksDetails>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public AddBookToLibraryCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }

        public async Task<LibraryBooksDetails> Handle(AddBookToLibraryCommand request, CancellationToken cancellationToken)
        {
            List<Library> result = new List<Library>();
            var found = await _context.Libraries.Include(x => x.Books).FirstOrDefaultAsync(x => x.Id == request.Id);
            var bookFound = await _context.Books.FirstOrDefaultAsync(x => x.UniqueBookId == request.BookId);
            if (isValid(found, bookFound, request) && bookFound != null && found != null)
            {
                var newBook = new Book
                {
                    Status = StatusValues.Available,
                    LibraryId = found.Id,
                    Author = bookFound.Author,
                    Category = bookFound.Category,
                    PdfFormat = bookFound.PdfFormat,
                    Picture = bookFound.Picture,
                    Title = bookFound.Title,
                    UniqueBookId = Guid.NewGuid()
                };

                if (bookFound.Picture.Contains("blob.core")&& bookFound.Picture != null)
                {
                    if(Uri.TryCreate(bookFound.Picture, UriKind.Absolute, out Uri blobUri))
                    {
                        var originalBlobClient = new BlobClient(blobUri);
                        var originalImageStream = new MemoryStream();
                        await originalBlobClient.DownloadToAsync(originalImageStream);
                        var newFileName = Guid.NewGuid().ToString();

                        var NewBlobClient = _blobContainer.GetBlobClient(newFileName);

                        originalImageStream.Position = 0;
                        await NewBlobClient.UploadAsync(originalImageStream);

                        newBook.Picture = NewBlobClient.Uri.ToString();
                    }
                  
                }
               
                await _context.Books.AddAsync(newBook);
                found.Books.Add(newBook);

                await _context.SaveChangesAsync();
                result.Add(found);
            }



            return LibraryBooksDetailsUtil.GetLibraryDetails(result).First();
        }
        public bool isValid(Library? library, Book? book, AddBookToLibraryCommand request)
        {
            if (library == null) throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "No library with that id was found");
            if (book == null) throw new HttpResponseException(HttpStatusCode.BadRequest, "No book with that Id was found");
            if (library.OwnerId == request.UserId)
                throw new HttpResponseException(HttpStatusCode.Forbidden,
                    "You can't remove books unless you are the owner of the library");
            return true;
        }
    }
}
