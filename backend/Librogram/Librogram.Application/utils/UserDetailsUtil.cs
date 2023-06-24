using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.utils
{
    public class UserDetailsUtil
    {
        public static List<UserDetails> GetUserDetails(ICollection<User> users)
        {
            if (users == null)
            {
                return null;
            }

            var userDetails = new List<UserDetails>();

            foreach (var user in users)
            {
                userDetails.Add(ConvertToUsertDetails(user));
            }

            return userDetails;
        }

        public static UserDetails ConvertToUsertDetails(User user)
        {
            if (user == null)
            {
                return null;
            }

            var userDetails = new UserDetails
            {
                Id = user.Id,
                BooksBorrowed = user.Borrowings.Count,
                Email = user.Email,
                NumberOfFavouriteBooks = user.FavouriteBooks.Count,
                NumberOfFriends = user.Friends.Count,
                NumberOfPosts = user.Posts.Count,
                NumberOfFollowedLibraries= user.FollowedLibraries.Count,
                Friends = user.Friends,
                FavouriteBooks = user.FavouriteBooks,
                FollowedLibraries = user.FollowedLibraries,
                PersonalLibrary = user.PersonalLibrary,
                Posts = user.Posts,
                Borrowings = user.Borrowings,
                ProfilePicture = user.ProfilePicture,
                Name = user.Name
            };

            return userDetails;
        }
    }
}
