using Librogram.Application.Books.Queries;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Librogram.Application.Books.QueryHandlers
{
    public class SearchByAuthorQueryHandler : IRequestHandler<SearchByAuthorQuery, List<Book>>
    {
        private readonly LibrogramContext _context;
        public SearchByAuthorQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<List<Book>> Handle(SearchByAuthorQuery request, CancellationToken cancellationToken)
        {
            if (request.LibraryId != Guid.Empty)
            {
                return await _context.Books.Include(x => x.Library).Where(x => x.Author.Contains(request.Author) && x.LibraryId == request.LibraryId).ToListAsync();
            }
            else
            {
                return await _context.Books.Include(x => x.Library).Where(x => x.Author.Contains(request.Author)).ToListAsync();
            }
        }
    }
}
