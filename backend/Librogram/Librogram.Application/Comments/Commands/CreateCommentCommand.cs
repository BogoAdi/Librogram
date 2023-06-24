using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Comments.Commands
{
    public class CreateCommentCommand : IRequest<Comment>
    {
        public Comment Comment { get; set; }
    }
}
