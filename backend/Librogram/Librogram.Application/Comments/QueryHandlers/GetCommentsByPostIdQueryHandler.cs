using Librogram.Application.Comments.Queries;
using Librogram.Application.Exceptions;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Comments.QueryHandlers
{
    public class GetCommentsByPostIdQueryHandler : IRequestHandler<GetCommentByPostIdQuery, List<Comment>>
    {
        private readonly LibrogramContext _context;

        public GetCommentsByPostIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<List<Comment>> Handle(GetCommentByPostIdQuery request, CancellationToken cancellationToken)
        {
            var post = _context.Posts.Any(x => x.Id == request.PostId);

            if (!post)
                throw new HttpResponseException(HttpStatusCode.BadRequest, "Post doesn't exist");

            return await _context.Comments
                        .Where(c => c.PostId == request.PostId)
                        .OrderByDescending(x => x.LastEditDate)
                        .Include(x => x.User)
                        .ToListAsync();
        }
    }
}
