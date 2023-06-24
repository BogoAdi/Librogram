using Librogram.Application.Books.Commands;
using Librogram.Application.Borrowings.Commands;
using Librogram.Application.Borrowings.cs.Commands;
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

namespace Librogram.Application.Borrowings.cs.CommandHandlers
{
    public class RemoveBorrowingCommandHandler : IRequestHandler<RemoveBorrowingCommand, Borrowing>
    {
        private readonly LibrogramContext _context;
        public RemoveBorrowingCommandHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<Borrowing> Handle(RemoveBorrowingCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Borrowings.FirstOrDefaultAsync(b => b.Id == request.Id);
            if (found is null)
                throw new HttpResponseException(HttpStatusCode.NotFound, $"The borrowing with the id {request.Id} \n doesn't exist");
            var bookFound = await _context.Books.FirstOrDefaultAsync(b => b.UniqueBookId == found.UniqueBookId);
            if (bookFound is null) throw new HttpResponseException(HttpStatusCode.BadRequest, $"The book with the id {request.Id} \n doesn't exist");
            bookFound.Status = StatusValues.Available;
            _context.Borrowings.Remove(found);
            await _context.SaveChangesAsync();

            return found;
        }
    }
}
