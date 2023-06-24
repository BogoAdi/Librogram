using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Librogram.Application.Exceptions;
using Librogram.Application.Libraries.Commands;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models.ExternalConnectors;
using System.Net;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Librogram.Application.Libraries.CommandHandlers
{
    public class CreateLibraryCommandHandler : IRequestHandler<CreateLibraryCommand, Library>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public CreateLibraryCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }

        public async Task<Library> Handle(CreateLibraryCommand request, CancellationToken cancellationToken)
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
            var library = new Library
            {
                Id = Guid.NewGuid(),
                IsPublic = request.IsPublic,
                OwnerId = request.OwnerId,
                Name = request.Name,
                Location= request.Location,
                Followers= new List<User>(),
                Description = request.Description,
                Books = new List<Book>(),
                ProfileImage = blobClient.Uri.ToString(),
            };
            var found = _context.Users.FirstOrDefault(x => x.Id == request.OwnerId);
            if(found == null ) throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "This Owner doesn't exists");
            if(found.PersonalLibraryId != Guid.Empty) throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "This user already has a library!");
            found.PersonalLibraryId = library.Id;

            _context.Libraries.Add(library);
            await _context.SaveChangesAsync();
            return library;
        }
    }
}
