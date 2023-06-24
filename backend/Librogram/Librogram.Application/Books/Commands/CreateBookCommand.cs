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
    public class CreateBookCommand : IRequest<Book>
    {
        public Book Book { get; set; }
        public IFormFile File { get; set; }
    }
}
