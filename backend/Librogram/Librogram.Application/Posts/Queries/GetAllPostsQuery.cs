using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Posts.Queries
{
    public class GetAllPostsQuery : IRequest<List<PostDetails>>
    {

    }
}
