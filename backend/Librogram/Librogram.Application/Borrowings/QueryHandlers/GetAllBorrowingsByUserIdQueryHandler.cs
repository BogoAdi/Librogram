using Librogram.Application.Borrowings.Queries;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.QueryHandlers
{
    public class GetAllBorrowingsByUserIdQueryHandler : IRequestHandler<GetAllBorrowingsByUserIdQuery, List<Borrowing>>
    {
        private readonly LibrogramContext _context;
        public GetAllBorrowingsByUserIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<List<Borrowing>> Handle(GetAllBorrowingsByUserIdQuery request, CancellationToken cancellationToken)
        {
            var results = await _context.Borrowings.Include(x => x.User).Include(x => x.Library).Include(x => x.Book).Where(x => x.UserId == request.UserId).ToListAsync();
            return results ;
        }
    }
}
