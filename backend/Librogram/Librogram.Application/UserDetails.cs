using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application
{
    public class UserDetails
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int NumberOfPosts { get; set; }
        public int NumberOfFriends { get; set; }
        public int BooksBorrowed { get; set; }
        public int NumberOfFavouriteBooks { get; set; }
        public int NumberOfFollowedLibraries { get; set; }
        public List<User>? Friends { get; set; }
        public string? ProfilePicture { get; set; }
        public List<Post>? Posts { get; set; }
        public List<Book>? FavouriteBooks { get; set; }
        public Library? PersonalLibrary { get; set; }
        public List<Library>? FollowedLibraries { get; set; }
        public List<Comment>? Comments { get; set; }
        public List<Reaction>? Reactions { get; set; }
        public List<Borrowing> Borrowings { get; set; }
    }
}
