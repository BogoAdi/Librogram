using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Api.DTOs.LibraryDTOs;
using Librogram.Api.DTOs.PostControllerDTOs;
using Librogram.Domain;

namespace Librogram.Api.DTOs.UserDTOs
{
    public class GetUserDetailsDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int NumberOfPosts { get; set; }
        public int NumberOfFriends { get; set; }
        public int BooksBorrowed { get; set; }
        public int NumberOfFavouriteBooks { get; set; }
        public int NumberOfFollowedLibraries { get; set; }
        public Guid PersonalLibraryId { get; set; }
        public List<UserProfileDTO>? Friends { get; set; }
        public string? ProfilePicture { get; set; }
        public List<PostOnlyDetailsDTO>? Posts { get; set; }
        public List<GetBookResultDto>? FavouriteBooks { get; set; }
        public GetOnlyLibraryDetails? PersonalLibrary { get; set; }
        public List<GetOnlyLibraryDetails>? FollowedLibraries { get; set; }
        public List<GetBorrowingLibraryDto>? Borrowing { get; set; }
    }
}
