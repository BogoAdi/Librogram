using Librogram.Domain;

namespace Librogram.Api.DTOs.LibraryDTOs
{
    public class CreateLibraryDto
    {
        public Guid OwnerId { get; set; }
        public string? Name { get; set; }
        public bool? IsPublic { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
    }
}
