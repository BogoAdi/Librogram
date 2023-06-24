using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.Queries
{
    public class GetAllBooksQuery : IRequest<List<Book>>
    {
        public bool Dublicates { get; set; }
    }
}
