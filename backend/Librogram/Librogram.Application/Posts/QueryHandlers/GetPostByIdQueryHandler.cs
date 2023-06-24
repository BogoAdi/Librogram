using CorporateSocialNetwork.Application.utils;
using Librogram.Application.Exceptions;
using Librogram.Application.Posts.Queries;
using Librogram.Dal;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Posts.QueryHandlers
{
    public class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, PostDetails>
    {
        private readonly LibrogramContext _context;

        public GetPostByIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<PostDetails> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
        {
            var post = await  _context.Posts.Include(x => x.Comments)
                                            .Include(x => x.Reactions)
                                            .Include(x=>x.User)
                                            .FirstOrDefaultAsync(x=>x.Id == request.Id);
            if (post == null)
                throw new HttpResponseException(HttpStatusCode.NotFound, $"post with the id  {request.Id} was not found");

            return ReactionDetailsUtil.ConvertToPostDetails(post);
        }
    }
}
