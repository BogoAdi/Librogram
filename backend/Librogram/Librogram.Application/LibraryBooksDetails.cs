using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application
{
    public class LibraryBooksDetails
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public User? Owner { get; set; }
        public string? Name { get; set; }
        public bool? IsPublic { get; set; }
        public string? Location { get; set; }
        public string? ProfileImage { get; set; }
        public int NumberOfBooks { get; set; }
        public List<Book> Books { get; set; } = new List<Book>();
    }
}
