using Librogram.Application.Books.Commands;
using Librogram.Application.Books.Queries;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.QueryHandlers
{
    public class GetAllBooksQueryHandler : IRequestHandler<GetAllBooksQuery, List<Book>>
    {
        private readonly LibrogramContext _context;
        public GetAllBooksQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<List<Book>> Handle(GetAllBooksQuery request, CancellationToken cancellationToken)
        {
                return await _context.Books.Include(x => x.Library)
                                            .OrderBy(x => x.Title)
                                            .OrderBy(x => x.Author)
                                            .ToListAsync();
        }
    }
}
