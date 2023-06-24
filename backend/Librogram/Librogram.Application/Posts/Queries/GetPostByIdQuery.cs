using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Posts.Queries
{
    public class GetPostByIdQuery : IRequest<PostDetails>
    {
        public Guid Id { get; set; }
    }
}
