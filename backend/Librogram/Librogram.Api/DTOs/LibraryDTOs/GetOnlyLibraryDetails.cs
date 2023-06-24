using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Api.DTOs.UserDTOs;

namespace Librogram.Api.DTOs.LibraryDTOs
{
    public class GetOnlyLibraryDetails
    {
        public Guid Id { get; set; }
        public Guid OwnerId { get; set; }
        public GetUserOnlyInfoDto? Owner { get; set; }
        public string? Name { get; set; }
        public bool? IsPublic { get; set; }
        public string ?ProfileImage { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }

    }
}
