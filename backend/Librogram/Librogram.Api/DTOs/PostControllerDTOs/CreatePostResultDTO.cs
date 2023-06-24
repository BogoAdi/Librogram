namespace Librogram.Api.DTOs.PostControllerDTOs
{
    public class CreatePostResultDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set; }
        public string Text { get; set; }
    }
}
