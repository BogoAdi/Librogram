using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class Borrowing
    {
        public Guid Id { get; set; }

        public Guid LibraryId { get; set; }
        public Library? Library { get; set; }

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid UniqueBookId { get; set; }
        public Book? Book { get; set; }

        public DateTime StartDate { get; set; }
        public int Duration { get; set; }
        public DateTime EndDate { get; set; }
        public BorrowStatus Status { get; set; }
    }
}
