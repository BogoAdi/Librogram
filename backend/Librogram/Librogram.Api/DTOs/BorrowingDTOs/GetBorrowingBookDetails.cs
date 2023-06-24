using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.UserDTOs;
using Librogram.Domain;

namespace Librogram.Api.DTOs.BorrowingDTOs
{
    public class GetBorrowingBookDetails
    {
        public Guid Id { get; set; }
        public Guid LibraryId { get; set; }
        public Guid UserId { get; set; }
        public Guid UniqueBookId { get; set; }
        public GetLibraryForBorrowingResultDto? Library { get; set; }
        public GetUserDetailsDto? User { get; set; }
        public DateTime StartDate { get; set; }
        public int Duration { get; set; }
        public DateTime EndDate { get; set; }
        public BorrowStatus Status { get; set; }
    }
}
