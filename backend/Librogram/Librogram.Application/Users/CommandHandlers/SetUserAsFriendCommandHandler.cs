using Librogram.Application.Exceptions;
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

namespace Librogram.Application.Users.CommandHandlers
{
    public class SetUserAsFriendCommandHandler : IRequestHandler<SetUserAsFriendCommand, bool>
    {
        private readonly LibrogramContext _context;
        public SetUserAsFriendCommandHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<bool> Handle(SetUserAsFriendCommand request, CancellationToken cancellationToken)
        {
            var personalUser = await _context.Users.Include(x=>x.Friends).FirstOrDefaultAsync(x => x.Id == request.PersonalUserId);
            if (personalUser == null) throw new HttpResponseException(HttpStatusCode.NotFound, $"the user with the id {request.PersonalUserId} doesn't exist");
            var userFound = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId);
            if (userFound == null) throw new HttpResponseException(HttpStatusCode.NotFound, $"the user with the id {request.UserId} doesn't exist");

            if (request.SetAsFriend)
                personalUser.Friends.Add(userFound);
            else
                personalUser.Friends.Remove(userFound);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
