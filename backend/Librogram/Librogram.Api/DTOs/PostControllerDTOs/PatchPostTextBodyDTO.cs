namespace Librogram.Api.DTOs.PostControllerDTOs
{
    public class PatchPostTextBodyDTO
    {
        public string Text { get; set; }
        public Guid UserId { get; set; }
    }
}
