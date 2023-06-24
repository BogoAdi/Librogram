using CorporateSocialNetwork.Application.utils;
using Librogram.Application.Posts.Queries;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Posts.QueryHandlers
{
    public class GetAllPostsQueryHandler : IRequestHandler<GetAllPostsQuery, List<PostDetails>>
    {
        private readonly LibrogramContext _context;

        public GetAllPostsQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<List<PostDetails>> Handle(GetAllPostsQuery request, CancellationToken cancellationToken)
        {
            var posts = await _context.Posts.OrderByDescending(x => x.LastEditDate)
                                            .Include(post => post.User)
                                            .Include(x => x.Comments)
                                            .Include(x => x.Reactions)
                                            .ToListAsync();

            var postDetails = ReactionDetailsUtil.GetPostDetails(posts);
            return postDetails;
        }
    }
}
