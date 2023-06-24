using Librogram.Application.Exceptions;
using Librogram.Application.Users.Commands;
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

namespace Librogram.Application.Users.CommandHandlers
{
    public class RemoveUserCommandHandler : IRequestHandler<RemoveUserCommand, User>
    {
        LibrogramContext _context;
        public RemoveUserCommandHandler(LibrogramContext context) 
        {
            _context = context;
        }
        public async Task<User> Handle(RemoveUserCommand request, CancellationToken cancellationToken)
        {
            var userToBeDeleted = _context.Users.Include(x=>x.Comments.Where(x=>x.UserId== request.Id))
                                                .Include(x=>x.Posts.Where(x=>x.UserId == request.Id))
                                                .Include(x=>x.Reactions.Where(x=>x.UserId== request.Id))
                                                .Include(x=>x.FollowedLibraries)
                                                .Include(x => x.Friends ).FirstOrDefault(x => x.Id == request.Id);
            if (userToBeDeleted == null) 
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "This user doesn't exist ");

            _context.Users.Remove(userToBeDeleted);
            await _context.SaveChangesAsync();

            return userToBeDeleted;
        }
    }
}
