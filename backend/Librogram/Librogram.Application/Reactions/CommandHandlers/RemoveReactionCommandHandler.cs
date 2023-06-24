using Librogram.Application.Exceptions;
using Librogram.Application.Reactions.Commands;
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

namespace Librogram.Application.Reactions.CommandHandlers
{
    public class RemoveReactionCommandHandler : IRequestHandler<RemoveReactionCommand, Reaction>
    {
        private readonly LibrogramContext _context;

        public RemoveReactionCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<Reaction> Handle(RemoveReactionCommand request, CancellationToken cancellationToken)
        {
            var reactionToDelete = await _context.Reactions.FirstOrDefaultAsync(x => x.UserId.Equals(request.UserId) && x.PostId.Equals(request.PostId));

            if (reactionToDelete is not null)
            {
                _context.Reactions.Remove(reactionToDelete);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest, "Couldn't find reaction");
            }

            return reactionToDelete;
        }
    }
}
