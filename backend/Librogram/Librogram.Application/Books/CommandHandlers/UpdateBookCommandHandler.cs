using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Librogram.Application.Books.Commands;
using Librogram.Application.Exceptions;
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
using System.Web;

namespace Librogram.Application.Books.CommandHandlers
{
    public class UpdateBookCommandHandler : IRequestHandler<UpdateBookCommand, Book>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public UpdateBookCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }
        public async Task<Book> Handle(UpdateBookCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Books.FirstOrDefaultAsync(x => x.UniqueBookId == request.UniqueBookId);
            if (found == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                  $"The Book with the id {request.UniqueBookId} doesn't exists");

            if (request.File != null)
            {

                var fileName = Guid.NewGuid().ToString();
                var blobClient = _blobContainer.GetBlobClient(fileName);
                var headers = new BlobHttpHeaders();
                headers.ContentType = request.File.ContentType;
                using (var fileStream = request.File.OpenReadStream())
                {
                    await blobClient.UploadAsync(fileStream, headers, conditions: null, cancellationToken: CancellationToken.None);
                }
                var newImage = blobClient.Uri.ToString();

                var blobClient1 = _blobContainer.GetBlobClient(Path.GetFileName(found.Picture));
                await blobClient1.DeleteIfExistsAsync();
                found.Picture = newImage;
            }
            if (!string.IsNullOrWhiteSpace(request.Author))
                found.Author = request.Author;
            if (!string.IsNullOrWhiteSpace(request.Title))
                found.Title = request.Title;
            if (!string.IsNullOrWhiteSpace(request.Category))
                found.Category = request.Category;
            if (!string.IsNullOrWhiteSpace(request.Description))
                found.Description = request.Description;
            await _context.SaveChangesAsync();
            return found;
        }
    }
}
