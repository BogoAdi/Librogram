using Librogram.Application.Borrowings.Commands;
using Librogram.Application.Exceptions;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.CommandHandlers
{
    public class SetBorrowingStatusCommandHandler : IRequestHandler<SetBorrowingStatusCommand, Borrowing>
    {
        private readonly LibrogramContext _context;
        public SetBorrowingStatusCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<Borrowing> Handle(SetBorrowingStatusCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Borrowings.Include(x => x.Book)
                                                 .Include(x => x.User)
                                                 .Include(x => x.Library)
                                                 .FirstOrDefaultAsync(x => x.Id == request.Id);

            if (isValid(request, found))
            {
                if(request.option == BorrowStatus.Finished)
                {
                    var book =  _context.Books.First(x => x.UniqueBookId == found.UniqueBookId);
                    book.Status = StatusValues.Available;
                }
                await _context.SaveChangesAsync();
            }

            return found;
        }
        public bool isValid(SetBorrowingStatusCommand request, Borrowing? borrowing)
        {
            if (borrowing == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest, $"The borrowing with the id {request.Id} \n doesn't exist");
            switch (request.option)
            {
                case BorrowStatus.Active:
                    {
                        if (borrowing.Status != BorrowStatus.WaitingConfirmation)
                            throw new HttpResponseException(HttpStatusCode.BadRequest, $"You can't activate a borrowing that wasn't put in the waiting state");                        
                        if (request.userId != borrowing.Library.OwnerId)
                        {
                            throw new HttpResponseException(HttpStatusCode.Forbidden, "Only the owner of the library can set the state of the borrow");
                        }
                        borrowing.Status = request.option;
                        break;
                    }
                case BorrowStatus.Denied:
                    {
                        if (borrowing.Status != BorrowStatus.WaitingConfirmation)
                            throw new HttpResponseException(HttpStatusCode.BadRequest, $"You can't activate a borrowing that wasn't put in the waiting state");
                        if (request.userId != borrowing.Library.OwnerId)
                        {
                            throw new HttpResponseException(HttpStatusCode.Forbidden, "Only the owner of the library can set the state of the borrow");
                        }
                        borrowing.Status = request.option;
                        break;
                    }
                case BorrowStatus.Finished:
                    {
                        if (borrowing.Status != BorrowStatus.Active)
                            throw new HttpResponseException(HttpStatusCode.BadRequest, $"You can't return a book which wasn't borrowed ");
                        if (request.userId != borrowing.Library.OwnerId)
                        {
                            throw new HttpResponseException(HttpStatusCode.Forbidden, "Only the owner of the library can set the state of the borrow");
                        }
                        borrowing.Status = request.option;
                        
                        break;
                    }
                default:
                    {
                        
                        break;
                    }
            }
           


            return true;
        }
    }
}
