using Librogram.Application.Exceptions;
using Librogram.Application.Libraries.Commands;
using Librogram.Application.Users.Commands;
using Librogram.Dal;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.CommandHandlers
{
    public class FollowLibraryCommandHandler : IRequestHandler<FollowLibraryCommand, bool>
    {
        private readonly LibrogramContext _context;
        public FollowLibraryCommandHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<bool> Handle(FollowLibraryCommand request, CancellationToken cancellationToken)
        {

            var personalUser = await _context.Users.Include(x => x.FollowedLibraries).FirstOrDefaultAsync(x => x.Id == request.PersonalUserId);
            if (personalUser == null)
                throw new HttpResponseException(HttpStatusCode.NotFound, $"the user with the id {request.PersonalUserId} doesn't exist");

            var libraryFound = await _context.Libraries.Include(x => x.Followers).FirstOrDefaultAsync(x => x.Id == request.LibraryId);
            if (libraryFound == null)
                throw new HttpResponseException(HttpStatusCode.NotFound, $"the Library with the id {request.LibraryId} doesn't exist");

            if (request.Follow)
            {
                personalUser.FollowedLibraries.Add(libraryFound);
                libraryFound.Followers.Add(personalUser);
            }

            else
            {
                personalUser.FollowedLibraries.Remove(libraryFound);
                libraryFound.Followers.Remove(personalUser);
            }


            await _context.SaveChangesAsync();

            return true;
        }
    }
}
