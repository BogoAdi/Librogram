using CorporateSocialNetwork.Application.utils;
using Librogram.Application.Exceptions;
using Librogram.Application.Posts.Commands;
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

namespace Librogram.Application.Posts.CommandHandlers
{
    public class EditPostCommandHandler : IRequestHandler<EditPostCommand, Post>
    {
        private readonly LibrogramContext _context;

        public EditPostCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<Post> Handle(EditPostCommand request, CancellationToken cancellationToken)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (post == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound,
                "Couldn't find specified post");
            }
            if (await isValid(request.Text, request.UserId, post))
            {
                post.Text = request.Text;
                post.LastEditDate = DateTime.Now;
                await _context.SaveChangesAsync();
            }
            return post;

        }

        private async Task<bool> isValid(string text, Guid userId, Post post)
        {

            if (post.UserId != userId)
                throw new HttpResponseException(HttpStatusCode.Forbidden, "You cannot edit posts that aren't yours");

            if (string.IsNullOrEmpty(PostTextRegex.StripHTMLtags(text)))
                throw new HttpResponseException(HttpStatusCode.BadRequest, "Post must contain at least one character");

            if (PostTextRegex.StripHTMLtags(text).Count() > 10000)
                throw new HttpResponseException(HttpStatusCode.BadRequest, "10.000 characters exceeded");

            return true;
        }
    }
}
