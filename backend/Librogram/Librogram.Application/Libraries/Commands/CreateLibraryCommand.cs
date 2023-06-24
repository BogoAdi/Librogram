using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.Commands
{
    public class CreateLibraryCommand : IRequest<Library>
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public string? Name { get; set; }
        public bool? IsPublic { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public int NumberOfBooks { get; set; }
        public List<Book> Books { get; set; } 
        public List<User> Followers { get; set; } 
        public IFormFile File { get; set; }
    }
}
