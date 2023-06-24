using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.Commands
{
    public class UpdateBookCommand : IRequest<Book>
    {
        public Guid UniqueBookId { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; }
        public string? Description { get; set; }
        public IFormFile? File { get; set; }
    }
}
