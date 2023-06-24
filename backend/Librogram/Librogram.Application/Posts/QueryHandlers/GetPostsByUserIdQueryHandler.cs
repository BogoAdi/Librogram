using CorporateSocialNetwork.Application.utils;
using Librogram.Application.Posts.Queries;
using Librogram.Dal;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Posts.QueryHandlers
{
    public class GetPostsByUserIdQueryHandler : IRequestHandler<GetPostsByUserIdQuery, List<PostDetails>>
    {
        private readonly LibrogramContext _context;

        public GetPostsByUserIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<List<PostDetails>> Handle(GetPostsByUserIdQuery request, CancellationToken cancellationToken)
        {
            var posts = await _context.Posts.Where(x => x.UserId == request.UserId)
                                            .Include(x => x.Comments)
                                            .Include(x => x.Reactions)
                                            .Include(x=>x.User)
                                            .OrderByDescending(x => x.LastEditDate)
                                            .ToListAsync();
            return ReactionDetailsUtil.GetPostDetails(posts); 
        }
    }
}
