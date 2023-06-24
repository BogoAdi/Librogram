using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Users.Commands
{
    public class UpdateUserCommand : IRequest<User>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public IFormFile File { get; set; }
    }
}
