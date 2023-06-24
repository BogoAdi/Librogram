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
    public class GetBookByIdQueryHandler : IRequestHandler<GetBookByIdQuery, Book>
    {
        private readonly LibrogramContext _context;
        public GetBookByIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<Book> Handle(GetBookByIdQuery request, CancellationToken cancellationToken)
        {
            var found = await _context.Books
                                            .Include(x => x.Library)
                                            .FirstOrDefaultAsync(x => x.UniqueBookId == request.Id);
            if (found == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                  $"The Book with the id {request.Id} doesn't exists");
            return found;
        }
    }
}
