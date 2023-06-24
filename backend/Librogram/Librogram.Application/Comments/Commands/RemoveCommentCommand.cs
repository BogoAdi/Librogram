using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Comments.Commands
{
    public class RemoveCommentCommand : IRequest<Comment>
    {
        public Guid UserId { get; set; }
        public Guid CommentId { get; set; }
    }
}
