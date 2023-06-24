using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Api.DTOs.LibraryDTOs;
using Librogram.Domain;

namespace Librogram.Api.DTOs.BookDTOs
{
    public class GetBookResultWithLibDto
    {
        public Guid UniqueBookId { get; set; }
        public Guid? LibraryId { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; }
        public bool PdfFormat { get; set; }
        public string? Picture { get; set; }
        public StatusValues Status { get; set; }
        public string? Description { get; set; }
        public GetOnlyLibraryDetails ?Library { get; set; }
    }
}
