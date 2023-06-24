namespace Librogram.Api.DTOs.UserDTOs
{
    public class UserPatchDTO
    {
        public string? Name { get; set; }
        public IFormFile? File { get; set; }
    }
}
