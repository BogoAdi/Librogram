using Librogram.Application.Exceptions;
using Librogram.Application.Posts.Commands;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Librogram.Application.Posts.CommandHandlers
{
    public class RemovePostCommandHandler : IRequestHandler<RemovePostCommand, bool>
    {
        public readonly LibrogramContext _context;
        public RemovePostCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(RemovePostCommand request, CancellationToken cancellationToken)
        {
            var found = await _context.Posts.FirstOrDefaultAsync(x=>x.Id == request.Id);
            if (found == null) throw new HttpResponseException(HttpStatusCode.NotFound, $"the post with the id : {request.Id} was not found");

            if(request.UserId != found.UserId) throw new HttpResponseException(HttpStatusCode.Forbidden, "You cannot edit posts that aren't yours");

            var deleted =  _context.Posts.Remove(found);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
