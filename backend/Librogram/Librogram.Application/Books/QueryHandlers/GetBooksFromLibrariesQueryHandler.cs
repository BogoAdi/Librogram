using Azure.Core;
using Librogram.Application.Books.Queries;
using Librogram.Application.Exceptions;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.QueryHandlers
{
    public class GetBooksFromLibrariesQueryHandler : IRequestHandler<GetBooksFromLibrariesQuery, List<Book>>
    {
        private readonly LibrogramContext _context;
        public GetBooksFromLibrariesQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> Handle(GetBooksFromLibrariesQuery request, CancellationToken cancellationToken)
        {
            var found = await _context.Libraries.Include(x=> x.Books)
                                                .FirstOrDefaultAsync(x => x.Id == request.LibraryId);
            if (found == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest,$"The Library with the id {request.LibraryId} \n doesn't exist");

            if (request.isExtended == false)
                {
                    var books = found.Books.GroupBy(book => new { book.Title, book.Author }).Select(g => g.First());
                    return books.ToList();
                }

                var bookList = found.Books.OrderBy(x=>x.Title).OrderBy(x=>x.Author).ToList();
                return bookList;
        }
    }
}
