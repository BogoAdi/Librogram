using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? ProfilePicture { get; set; }

        public List<User> Friends { get; set; } = new List<User>();
        
        public Guid PersonalLibraryId { get; set; }
        public Library? PersonalLibrary { get; set; }

        public List<Library> FollowedLibraries { get; set; } = new List<Library>();

        public List<Post> Posts { get; set; } = new List<Post>();
        public List<Book> FavouriteBooks { get; set; } = new List<Book>();
        public List<Comment> Comments { get; set; } = new List<Comment>();
        public List<Reaction> Reactions { get; set; } = new List<Reaction>();
        public List<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
    }
}
