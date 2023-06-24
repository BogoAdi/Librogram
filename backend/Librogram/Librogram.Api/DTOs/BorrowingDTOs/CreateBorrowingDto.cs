using Librogram.Domain;

namespace Librogram.Api.DTOs.BorrowingDTOs
{
    public class CreateBorrowingDto
    {
        public Guid UserId { get; set; }
        public Guid UniqueBookId { get; set; }
        public DateTime StartDate { get; set; }
        public int Duration { get; set; }
    }
}
