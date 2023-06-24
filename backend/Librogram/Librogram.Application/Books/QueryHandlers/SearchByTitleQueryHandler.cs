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
    public class SearchByTitleQueryHandler : IRequestHandler<SearchByTitleQuery, List<Book>>
    {
        private readonly LibrogramContext _context;
        public SearchByTitleQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> Handle(SearchByTitleQuery request, CancellationToken cancellationToken)
        {
            if (request.LibraryId != Guid.Empty)
            {
                return await _context.Books.Include(x => x.Library).Where(x => x.Title.Contains(request.Title) && x.LibraryId == request.LibraryId).ToListAsync();
            }
            else
            {
              return await _context.Books.Include(x => x.Library).Where(x => x.Title.Contains(request.Title)).ToListAsync();
            }
        }
    }
}
