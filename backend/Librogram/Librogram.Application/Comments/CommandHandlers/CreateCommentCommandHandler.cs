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
    public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, Comment>
    {
        private readonly LibrogramContext _context;

        public CreateCommentCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<Comment> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
        {
            var specifiedUser = await _context.Users.FirstOrDefaultAsync(x=>x.Id == request.Comment.UserId);

            if (specifiedUser == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest, "User doesn't exist");

            var comment = new Comment
            {
                Id = Guid.NewGuid(),
                User = specifiedUser,
                UserId = request.Comment.UserId,
                PostId = request.Comment.PostId,
                CreationDate = DateTime.Now,
                LastEditDate = DateTime.Now,
                Text = request.Comment.Text
            };

            var post = await _context.Posts.Include(x=>x.Comments).FirstOrDefaultAsync(x => x.Id == comment.PostId);
            if (post == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest, "Post doesn't exist");
            
            _context.Comments.Add(comment);
            post.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return comment;
        }
    }
}
