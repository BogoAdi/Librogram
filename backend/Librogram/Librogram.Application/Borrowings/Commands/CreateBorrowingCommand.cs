using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Borrowings.cs.Commands
{
    public class CreateBorrowingCommand : IRequest<Borrowing>
    {
        public Borrowing Borrowing { get; set; }
    }
}
