using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.Commands
{
    public class SetBorrowingStatusCommand : IRequest<Borrowing>
    {
        public Guid Id { get; set; }
        public BorrowStatus option { get; set; }
        public Guid userId { get; set; }
    }
}
