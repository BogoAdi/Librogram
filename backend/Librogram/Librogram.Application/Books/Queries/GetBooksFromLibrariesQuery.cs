using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.Queries
{
    public class GetBooksFromLibrariesQuery : IRequest<List<Book>>
    {
        public Guid LibraryId { get; set; }
        public bool isExtended { get; set; }
    }
}
