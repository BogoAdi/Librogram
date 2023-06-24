using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Api.DTOs.UserDTOs;
using Librogram.Domain;

namespace Librogram.Api.DTOs.LibraryDTOs
{
    public class GetLibraryDetailsDto
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public UserProfileDTO? Owner { get; set; }
        public string? Name { get; set; }
        public string ?ProfileImage { get; set; }
        public bool? IsPublic { get; set; }
        public string? Location { get; set; }
        public string ? Description { get; set; }
        public int NumberOfBooks { get; set; }
        public int NumberOfFollowers { get; set; }
        public int TotalBorrowings { get; set; }
        public int ActiveBorrowings { get; set; }
        public List<GetBookResultDto>? Books { get; set; }
        public List<GetUserOnlyInfoDto>? Followers { get; set; }
        public List<GetBorrowingLibraryDto>? Borrowings { get; set; }
    }
}
