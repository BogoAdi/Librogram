using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class Book
    {
        public Guid Id { get; set; }
        public Guid UniqueBookId { get; set; }
        public Guid LibraryId { get; set; }

        public Library? Library { get; set; }
       
        public string ?Title { get; set; }
        public string?Author { get; set; }
        public string ?Category { get; set; }
        public string ?Picture { get; set; }
        public string? Description { get; set; }
        public bool PdfFormat { get; set; }
        public StatusValues Status { get; set; }


        public List<Borrowing>? Borrowings { get; set; } = new List<Borrowing>();
    }
}
