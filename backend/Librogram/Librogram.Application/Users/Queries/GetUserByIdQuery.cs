using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Users.Queries
{
    public  class GetUserByIdQuery : IRequest<UserDetails>
    {
        public Guid  Id { get; set; }
    }
}
