using Librogram.Application.Borrowings.Queries;
using Librogram.Application.Exceptions;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.QueryHandlers
{
    public class GetBorrowingByIdQueryHandler : IRequestHandler<GetBorrowingByIdQuery, Borrowing>
    {

        private readonly LibrogramContext _context;
        public GetBorrowingByIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<Borrowing> Handle(GetBorrowingByIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _context.Borrowings.Include(x => x.User).Include(x => x.Library).Include(x => x.Book).FirstOrDefaultAsync(x => x.Id == request.Id);
            if (result == null) throw new HttpResponseException(HttpStatusCode.NotFound, "this borrowing wasn't found!");
            return result;
        }
    }
}
