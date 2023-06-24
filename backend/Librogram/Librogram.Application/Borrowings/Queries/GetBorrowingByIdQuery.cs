using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.Queries
{
    public class GetBorrowingByIdQuery : IRequest<Borrowing>
    {
        public Guid Id { get; set; }
    }
}
