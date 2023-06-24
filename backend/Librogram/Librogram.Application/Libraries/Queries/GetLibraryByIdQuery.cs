using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.Queries
{
    public class GetLibraryByIdQuery : IRequest<LibraryDetails>
    {
        public Guid Id { get; set; }
    }
}
