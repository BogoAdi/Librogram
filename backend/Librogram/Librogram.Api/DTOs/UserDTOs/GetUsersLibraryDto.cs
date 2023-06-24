using Librogram.Domain;

namespace Librogram.Api.DTOs.UserDTOs
{
    public class GetUserOnlyInfoDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? ProfilePicture { get; set; }
        public Guid PersonalLibraryId { get; set; }
    }
}
