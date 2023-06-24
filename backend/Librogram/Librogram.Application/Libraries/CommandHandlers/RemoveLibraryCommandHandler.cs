using Azure.Storage.Blobs;
using Librogram.Application.Exceptions;
using Librogram.Application.Libraries.Commands;
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
    public class RemoveLibraryCommandHandler : IRequestHandler<RemoveLibraryCommand, Library>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public RemoveLibraryCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }
        public async Task<Library> Handle(RemoveLibraryCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Libraries.Include(x => x.Books)
                                                .Include(x => x.Followers)
                                                .Include(x => x.Borrowings)
                                                .FirstOrDefaultAsync(x => x.Id == request.Id);
            var user = _context.Users.FirstOrDefault(x => x.Id == request.OwnerId);
            if (user == null) throw new HttpResponseException(HttpStatusCode.BadRequest,
                 "This Owner doesn't");

            if (found != null && found.OwnerId == request.OwnerId)
            {

                user.PersonalLibraryId = Guid.Empty;

                var blobClient1 = _blobContainer.GetBlobClient(Path.GetFileName(found.ProfileImage));
                await blobClient1.DeleteIfExistsAsync();

                _context.Libraries.Remove(found);
                await _context.SaveChangesAsync();
            }
            return found;
        }
        public bool isValid(Library? library, Book? book, RemoveLibraryCommand request)
        {
            if (library is null) throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "No library with that id was found");
            if (library.OwnerId == request.OwnerId)
                throw new HttpResponseException(HttpStatusCode.Forbidden,
                    "You can't delete this library unless you are the owner ");
            return true;
        }
    }
}
