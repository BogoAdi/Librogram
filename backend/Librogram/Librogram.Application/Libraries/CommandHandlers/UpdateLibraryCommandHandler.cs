using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Librogram.Application.Exceptions;
using Librogram.Application.Libraries.Commands;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models.ExternalConnectors;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.CommandHandlers
{
    public class UpdateLibraryCommandHandler : IRequestHandler<UpdateLibraryCommand, Library>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public UpdateLibraryCommandHandler(LibrogramContext context , IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }

        public async Task<Library> Handle(UpdateLibraryCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Libraries.Include(x=>x.Owner).FirstOrDefaultAsync(x => x.Id == request.Id );
            if (found == null)
                throw new HttpResponseException(HttpStatusCode.Forbidden,
                 "There isn't a library with that id ");

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

                var blobClient1 = _blobContainer.GetBlobClient(Path.GetFileName(found.ProfileImage));
                await blobClient1.DeleteIfExistsAsync();
                found.ProfileImage = newImage;
            }

            if (request.OwnerId != found.OwnerId)
                throw new HttpResponseException(HttpStatusCode.Forbidden,
                    "You can't modify informations about this library unless you are the owner ");
            if(!string.IsNullOrWhiteSpace(request.Name))
                found.Name = request.Name;

            if (!string.IsNullOrWhiteSpace(request.Location))
                found.Location = request.Location;
            if (!string.IsNullOrWhiteSpace(request.Description))
                found.Description = request.Description;

            await _context.SaveChangesAsync();
            return found;
        }
    }
}
