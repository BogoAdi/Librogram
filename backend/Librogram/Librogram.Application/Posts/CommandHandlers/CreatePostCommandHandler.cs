using CorporateSocialNetwork.Application.utils;
using Librogram.Application.Exceptions;
using Librogram.Application.Posts.Commands;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using System.Net;
using Post = Librogram.Domain.Post;

namespace Librogram.Application.Posts.CommandHandlers
{
    public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, Post>
    {
        private readonly LibrogramContext _context;
        public CreatePostCommandHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<Post> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {

            var newPost = new Post
            {
                Id = Guid.NewGuid(),
                CreationDate = DateTime.Now,
                LastEditDate = DateTime.Now,
                Text = request.Post.Text,
                UserId = request.Post.UserId
            };

            var found = _context.Users.Any(x => x.Id == request.Post.UserId);
            if (!found)
                throw new HttpResponseException(HttpStatusCode.NotFound,
                    "Couldn't find that user");

            if (IsValid(request.Post.Text))
            {
                _context.Posts.Add(newPost);
                await _context.SaveChangesAsync();
                return newPost;
            }
            return null;
        }
        private bool IsValid(string text)
        {
            if (string.IsNullOrEmpty(PostTextRegex.StripHTMLtags(text)))
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "Post must include at least one character");

            if (PostTextRegex.StripHTMLtags(text).Count() > 10000)
                throw new HttpResponseException(HttpStatusCode.BadRequest,
                    "10.000 characters exceeded");

            return true;
        }
    }
}
