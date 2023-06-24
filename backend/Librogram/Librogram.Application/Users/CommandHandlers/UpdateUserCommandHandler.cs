using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Librogram.Application.Exceptions;
using Librogram.Application.Users.Commands;
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

namespace Librogram.Application.Users.CommandHandlers
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, User>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public UpdateUserCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }


        public async Task<User> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Users.FirstOrDefaultAsync(x=>x.Id == request.Id);
            if (found == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                     "This user doesn't exist ");

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

                var blobClient1 = _blobContainer.GetBlobClient(Path.GetFileName(found.ProfilePicture));
                await blobClient1.DeleteIfExistsAsync();
                found.ProfilePicture = newImage;
            }
            if (!string.IsNullOrWhiteSpace(request.Name))
                found.Name = request.Name;
            await _context.SaveChangesAsync();

            return found;

        }
    }
}
