namespace Librogram.Api.DTOs.CommentDTOs
{
    public class PatchCommentBodyDTO
    {
        public string Text { get; set; }
        public Guid UserId { get; set; }
    }
}
