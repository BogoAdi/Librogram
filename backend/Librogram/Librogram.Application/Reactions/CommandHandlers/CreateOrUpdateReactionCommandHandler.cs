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
    public class CreateOrUpdateReactionCommandHandler : IRequestHandler<CreateOrUpdateReactionCommand, Reaction>
    {
        private readonly LibrogramContext _context;

        public CreateOrUpdateReactionCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<Reaction> Handle(CreateOrUpdateReactionCommand request, CancellationToken cancellationToken)
        {
            var postReaction = new Reaction
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                PostId = request.PostId,
                Emote = request.Reaction,
            };

            if (existingReaction(request.UserId, request.PostId))
            {
                var user = _context.Users.Any(x => x.Id == postReaction.UserId);
                var post = _context.Posts.Any(x => x.Id == postReaction.PostId);
                var reaction = _context.Reactions.Any(x => x.UserId == postReaction.UserId && x.PostId == postReaction.PostId);

                if (!user)
                    throw new HttpResponseException(HttpStatusCode.BadRequest, "User doesn't exist");

                if (!post)
                    throw new HttpResponseException(HttpStatusCode.BadRequest, "Post doesn't exist");

                if (reaction)
                    throw new HttpResponseException(HttpStatusCode.BadRequest, "Reaction already exists");

                postReaction.User = _context.Users.FirstOrDefault(x => x.Id == request.UserId);
                _context.Add(postReaction);
                await _context.SaveChangesAsync();
                return postReaction;
            }
            else
            {
                var reactionToUpdate = await _context.Reactions.FirstOrDefaultAsync(x => x.UserId.Equals(postReaction.UserId) && x.PostId.Equals(postReaction.PostId));

                if (reactionToUpdate is not null)
                {
                    reactionToUpdate.Emote = postReaction.Emote;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new HttpResponseException(HttpStatusCode.BadRequest, "Couldn't find reaction");
                }

                return postReaction;
            }
            

        }
        private bool existingReaction(Guid UserId, Guid PostId)
        {
            var postReaction = _context.Reactions.FirstOrDefault(x => x.UserId == UserId && x.PostId == PostId);
            if (postReaction != null)
                return false;

            return true;
        }
    }
}
