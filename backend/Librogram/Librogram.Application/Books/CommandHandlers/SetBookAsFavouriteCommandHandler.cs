using Librogram.Application.Books.Commands;
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

namespace Librogram.Application.Books.CommandHandlers
{
    public class SetBookAsFavouriteCommandHandler : IRequestHandler<SetBookAsFavouriteCommand, bool>
    {
        private readonly LibrogramContext _context;
        public SetBookAsFavouriteCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(SetBookAsFavouriteCommand request, CancellationToken cancellationToken)
        {
            var userFound = await _context.Users.Include(x => x.FavouriteBooks).FirstOrDefaultAsync(x => x.Id == request.UserId);
            if (userFound == null) throw new HttpResponseException(HttpStatusCode.NotFound, $"the user with the id {request.UserId} doesn't exist");
            var bookFound = await  _context.Books.FirstOrDefaultAsync(x => x.UniqueBookId == request.BookId);
            if (bookFound == null) throw new HttpResponseException(HttpStatusCode.NotFound, $"the book with the id {request.BookId} doesn't exist");

            if (request.SetFavourite)
            {
                userFound.FavouriteBooks.Add(bookFound);
            }

            else
            {
                userFound.FavouriteBooks.Remove(bookFound);
            }

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
