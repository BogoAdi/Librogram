

namespace Librogram.Api.DTOs.CommentDTOs
{
    public class CreateCommentBodyDTO
    {
        public Guid PostId { get; set; }
        public string Text { get; set; }
        public Guid UserId { get; set; }
    }
}
