using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Users.Commands
{
    public class RemoveUserCommand : IRequest<User>
    {
        public Guid Id { get; set; }
    }
}
