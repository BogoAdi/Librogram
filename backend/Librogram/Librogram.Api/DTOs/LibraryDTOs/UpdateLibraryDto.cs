using Librogram.Domain;
using System.ComponentModel.DataAnnotations;

namespace Librogram.Api.DTOs.LibraryDTOs
{
    public class UpdateLibraryDto
    {
        [Required]
        public Guid OwnerId { get; set; }
        public IFormFile? File { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
    }
}
