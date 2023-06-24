using Azure.Storage.Blobs;
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

namespace Librogram.Application.Books.CommandHandlers
{
    public class RemoveBookCommandHandler : IRequestHandler<RemoveBookCommand, Book>
    {
        public readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;

        public RemoveBookCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context= context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }

        public async Task<Book> Handle(RemoveBookCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Books.FirstOrDefaultAsync(x=>x.UniqueBookId == request.Id);
           
            if (found == null)
                throw new HttpResponseException(HttpStatusCode.NotFound,
                   $"The Book with the id {request.Id} doesn't exists");
            if (found.Status == StatusValues.Borrowed)
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                   $"You can't remove the book {found.Title} written by {found.Author}  because is still borrowed");

            var blobClient1 = _blobContainer.GetBlobClient(Path.GetFileName(found.Picture));
            await blobClient1.DeleteIfExistsAsync();

            var allFavs =_context.Users.Include(x => x.FavouriteBooks).Where(x => x.FavouriteBooks.Contains(found));
            foreach (var user in allFavs)
            {
                user.FavouriteBooks.Remove(found);
            }
            _context.Books.Remove(found);
                await _context.SaveChangesAsync();
            return found;
        }
    }
}
