using Librogram.Application.Borrowings.Commands;
using Librogram.Application.Borrowings.cs.Commands;
using Librogram.Application.Exceptions;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Librogram.Application.Borrowings.cs.CommandHandlers
{
    public class CreateBorrowingCommandHandler : IRequestHandler<CreateBorrowingCommand, Borrowing>
    {
        private readonly LibrogramContext _context;
        public CreateBorrowingCommandHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<Borrowing> Handle(CreateBorrowingCommand request, CancellationToken cancellationToken)
        {
            var book = await _context.Books.FirstOrDefaultAsync(x=>x.UniqueBookId == request.Borrowing.UniqueBookId);
            if (book == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest, $"The book with the id {request.Borrowing.UniqueBookId} \n doesn't exist");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.Borrowing.UserId);
            if (user == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest, $"This User with the id {request.Borrowing.UserId} \n doesn't exist");

            var library = await _context.Libraries.FirstOrDefaultAsync(x => x.Id == book.LibraryId);
            if (library == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest, $"This Library with the id {request.Borrowing.LibraryId} \n doesn't exist");

            book.Status = StatusValues.Borrowed;
            var borrowing = new Borrowing
            {
                Id = Guid.NewGuid(),
                StartDate = request.Borrowing.StartDate,
                LibraryId = request.Borrowing.LibraryId,
                UniqueBookId = request.Borrowing.UniqueBookId,
                UserId = request.Borrowing.UserId,
                Duration = request.Borrowing.Duration,
                EndDate = request.Borrowing.StartDate.AddDays(request.Borrowing.Duration),
                Status = BorrowStatus.WaitingConfirmation,
                Book = book,
                Library = library,
                User = user
            };
            
            await _context.Borrowings.AddAsync(borrowing);
            await _context.SaveChangesAsync();
            return borrowing;
        }
    }
}
