using Librogram.Application.Borrowings.cs.Queries;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.cs.QueryHandlers
{
    public class GetAllBookingsQueryHandler : IRequestHandler<GetAllBorrowingsQuery, List<Borrowing>>
    {
        private readonly LibrogramContext _context;
        public GetAllBookingsQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<List<Borrowing>> Handle(GetAllBorrowingsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Borrowings.Include(x=>x.User).Include(x=>x.Book).Include(x=>x.Library).ToListAsync();
        }
    }
}
