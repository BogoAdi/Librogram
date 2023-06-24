using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.Commands
{
    public class UpdateLibraryCommand : IRequest<Library>
    {
        public Guid OwnerId { get; set; }
        public Guid Id { get; set; }
        public string? ProfileImage { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public IFormFile? File { get; set; }
        public string? Description { get; set; }
    }
}
