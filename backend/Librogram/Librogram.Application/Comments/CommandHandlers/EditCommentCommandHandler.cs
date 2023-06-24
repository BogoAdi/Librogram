using CorporateSocialNetwork.Application.utils;
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
using static System.Net.Mime.MediaTypeNames;

namespace Librogram.Application.Comments.CommandHandlers
{
    public class EditCommentCommandHandler : IRequestHandler<EditCommentCommand, Comment>
    {
        private readonly LibrogramContext _context;

        public EditCommentCommandHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<Comment> Handle(EditCommentCommand command, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(x => x.Id == command.Id);

            if(comment == null)
                throw new HttpResponseException(HttpStatusCode.NotFound,
                    "Couldn't find specified comment");
            var specifiedUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == comment.UserId);

            if (specifiedUser == null)
                throw new HttpResponseException(HttpStatusCode.NotFound, "User doesn't exist");

            if ( isValid(command.Text, command.UserId, comment))
            {
                if (comment == null)
                    throw new HttpResponseException(HttpStatusCode.NotFound, "Comment doesn't exist");

                comment.Text = command.Text;
                comment.LastEditDate = DateTime.Now;
                
                await _context.SaveChangesAsync();
                comment.User = specifiedUser;
            }
            return comment;
        }

        private bool isValid(string text, Guid userId, Comment comment)
        {
            if (comment.UserId != userId)
                throw new HttpResponseException(HttpStatusCode.Forbidden, "You cannot edit comments that aren't yours");

            if (string.IsNullOrEmpty(PostTextRegex.StripHTMLtags(text)))
                throw new HttpResponseException(HttpStatusCode.BadRequest, "Comment must contain at least one character");

            if (PostTextRegex.StripHTMLtags(text).Count() > 10000)
                throw new HttpResponseException(HttpStatusCode.BadRequest, "10.000 characters exceeded");

            return true;
        }
    }
}
