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
    public class CreateUserCommand  :IRequest<User>
    {
        public User? UserCommand { get; set; }
        public IFormFile? File { get; set; }
    }
}
