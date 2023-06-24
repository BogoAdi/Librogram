using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Reactions.Queries
{
    public class GetGroupedReactionByPostIdQuery : IRequest<List<GroupedReactions>>
    {
        public Guid PostId { get; set; }
    }
}
