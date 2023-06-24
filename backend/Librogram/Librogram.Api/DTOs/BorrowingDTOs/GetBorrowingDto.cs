using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.UserDTOs;
using Librogram.Domain;

namespace Librogram.Api.DTOs.BorrowingDTOs
{
    public class GetBorrowingDto
    {
        public Guid Id { get; set; }
        public Guid LibraryId { get; set; }
        public Guid UserId { get; set; }
        public Guid UniqueBookId { get; set; }
        public GetUserOnlyInfoDto User { get; set; }
        public GetBookResultDto Book { get; set; }
        public GetLibraryForBorrowingResultDto Library { get; set; }
        public DateTime StartDate { get; set; }
        public int Duration { get; set; }
        public DateTime EndDate { get; set; }
        public BorrowStatus Status { get; set; }
    }
}
