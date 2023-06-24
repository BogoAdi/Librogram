using Librogram.Application.Exceptions;
using Librogram.Application.Reactions.Queries;
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

namespace Librogram.Application.Reactions.QueryHandlers
{
    public class GetReactionsOfPostQueryHandler : IRequestHandler<GetReactionsOfPostQuery, List<Reaction>>
    {
        private readonly LibrogramContext _context;

        public GetReactionsOfPostQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<List<Reaction>> Handle(GetReactionsOfPostQuery request, CancellationToken cancellationToken)
        {
            var post = _context.Posts.Any(x => x.Id == request.PostId);
            if (!post)
                throw new HttpResponseException(HttpStatusCode.NotFound, "Post doesn't exist");
            return await _context.Reactions
                .Where(p => p.PostId == request.PostId)
                .Include(x => x.User)
                .ToListAsync();
        }
    }
}
