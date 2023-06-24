using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.Queries
{
    public class SearchByTitleQuery : IRequest<List<Book>>
    {
        public string Title { get; set; }
        public Guid LibraryId { get; set; }
    }
}
