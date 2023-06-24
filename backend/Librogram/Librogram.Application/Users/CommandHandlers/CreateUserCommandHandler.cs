using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Librogram.Application.Exceptions;
using Librogram.Application.Users.Commands;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Users.CommandHandlers
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, User>
    {
        private readonly LibrogramContext _context;
        private readonly BlobContainerClient _blobContainer;
        public CreateUserCommandHandler(LibrogramContext context, IConfiguration configuration)
        {
            _context = context;
            _blobContainer = new BlobContainerClient(configuration.GetConnectionString("AzureConnectionString"), configuration.GetSection("BlobContainer").Value);
        }
        public async Task<User> Handle(CreateUserCommand command, CancellationToken cancellationToken)
        {
           

            var user = new User
            {
                Id = command.UserCommand.Id,
                Email = command.UserCommand.Email,
                Name = command.UserCommand.Name!= null? command.UserCommand.Name: command.UserCommand.Email,
                FavouriteBooks = new List<Book>(),
                FollowedLibraries = new List<Library>(),
                Borrowings = new List<Borrowing>(),
                Comments = new List<Comment>(),
                Friends = new List<User>()
            };
            if (command.File != null)
            {
                var fileName = Guid.NewGuid().ToString();
                var blobClient = _blobContainer.GetBlobClient(fileName);
                var headers = new BlobHttpHeaders();
                headers.ContentType = command.File.ContentType;
                using (var fileStream = command.File.OpenReadStream())
                {
                    await blobClient.UploadAsync(fileStream, headers, conditions: null, cancellationToken: CancellationToken.None);
                }
                user.ProfilePicture = blobClient.Uri.ToString();
            }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
