using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Reactions.Queries
{
    public class GetReactionsOfPostQuery : IRequest<List<Reaction>>
    {
        public Guid PostId { get; set; }
    }
}
