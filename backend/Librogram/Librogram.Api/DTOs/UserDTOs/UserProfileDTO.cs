namespace Librogram.Api.DTOs.UserDTOs
{
    public class UserProfileDTO
    {
        public Guid UserId { get; set; }
        public string? Name { get; set; }
        public Guid PersonalLibraryId { get; set; }
        public string? ProfilePicture {  get; set; }
    }
}
