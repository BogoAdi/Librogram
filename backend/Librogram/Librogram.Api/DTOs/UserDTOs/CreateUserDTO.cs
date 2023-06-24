namespace Librogram.Api.DTOs.UserDTOs
{
    public class CreateUserDTO
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public IFormFile? File { get; set; }
    }
}
