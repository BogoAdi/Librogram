using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.Commands
{
    public class RemoveLibraryCommand : IRequest<Library>
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
    }
}
