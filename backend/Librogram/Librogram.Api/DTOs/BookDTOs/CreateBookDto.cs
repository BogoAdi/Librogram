using Librogram.Domain;

namespace Librogram.Api.DTOs.BookDTOs
{
    public class CreateBookDto
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; }
        public IFormFile? File { get; set; }
        public Guid LibraryId { get; set; }
        public string? Description { get; set; }
    }
}
