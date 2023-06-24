using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Reactions.Commands
{
    public class CreateOrUpdateReactionCommand : IRequest<Reaction>
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public EmoteReaction Reaction { get; set; }
    }
}
