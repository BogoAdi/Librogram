using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application
{
    public class LibraryDetails
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public User? Owner { get; set; }
        public string? Name { get; set; }
        public bool? IsPublic { get; set; }
        public string? Location { get; set; }
        public string? ProfileImage { get; set; }
        public string? Description { get; set; }
        public int NumberOfBooks { get; set; }
        public int NumberOfFollowers { get; set; }
        public int TotalBorrowings { get; set; }
        public int ActiveBorrowings { get; set; }  
        public List<Book>? Books { get; set; }
        public List<User>? Followers { get; set; }
        public List<Borrowing>? Borrowings { get; set; }
    }
}
