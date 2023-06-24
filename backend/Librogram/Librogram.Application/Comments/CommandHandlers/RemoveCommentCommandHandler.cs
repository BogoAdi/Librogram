using Librogram.Application.Comments.Commands;
using Librogram.Application.Exceptions;
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

namespace Librogram.Application.Comments.CommandHandlers
{
    public class RemoveCommentCommandHandler : IRequestHandler<RemoveCommentCommand, Comment>
    {
        private readonly LibrogramContext _context;

        public RemoveCommentCommandHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<Comment> Handle(RemoveCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments.Include(x=>x.User)
                                                 .FirstOrDefaultAsync(x => x.Id == request.CommentId);

            if (comment == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest, "Comment doesn't exist");

            if (IsValid(comment, request.UserId))
            {
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
            }
            else
                throw new HttpResponseException(HttpStatusCode.BadRequest, "Something went wrong");
            return comment;
        }

        public bool IsValid(Comment comment, Guid userId)
        {
            if (!comment.UserId.Equals(userId)) 
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden, "You cannot delete comments that arent yours");
            }

            return true;
        }
    }
}
