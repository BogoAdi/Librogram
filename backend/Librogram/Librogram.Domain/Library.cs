using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class Library
    {
        public Guid Id { get; set; }

        public Guid OwnerId { get; set; }
        public User? Owner { get; set; }

        public string ?ProfileImage { get; set; }
        public string? Name { get; set; }
        public bool? IsPublic { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }

        public List<User> Followers { get; set; } = new List<User>();
        public List<Book> Books { get; set; } = new List<Book>();
        public List<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
    }
}
