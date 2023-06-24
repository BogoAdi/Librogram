using Librogram.Application.Exceptions;
using Librogram.Application.Reactions.Queries;
using Librogram.Dal;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Reactions.QueryHandlers
{
    public class GetGroupedReactionByPostIdQueryHandler : IRequestHandler<GetGroupedReactionByPostIdQuery, List<GroupedReactions>>
    {
        private readonly LibrogramContext _context;

        public GetGroupedReactionByPostIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<List<GroupedReactions>> Handle(GetGroupedReactionByPostIdQuery request, CancellationToken cancellationToken)
        {
            var post = _context.Posts.Any(x => x.Id == request.PostId);
            if (!post)
                throw new HttpResponseException(HttpStatusCode.NotFound, "Post doesn't exist");

            var reactionsList = await _context.Reactions
                        .Where(p => p.PostId == request.PostId)
                .Include(x => x.User)
                .ToListAsync();

            return reactionsList
                .GroupBy(x => x.Emote)
                .Select((x) => new GroupedReactions
                {
                    Emote = x.Key,
                    Count = x.Count(),
                    PeopleThatReactedThatWay = x.Select(x => x.User).ToList()
                }
               ).ToList();
        }
    }
}
