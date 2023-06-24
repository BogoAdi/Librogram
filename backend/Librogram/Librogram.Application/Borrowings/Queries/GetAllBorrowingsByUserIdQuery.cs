using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.Queries
{
    public class GetAllBorrowingsByUserIdQuery : IRequest<List<Borrowing>>
    {
        public Guid UserId { get; set; }
    }
}
