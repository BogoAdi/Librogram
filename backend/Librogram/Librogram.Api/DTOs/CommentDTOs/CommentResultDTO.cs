using Librogram.Api.DTOs.UserDTOs;

namespace Librogram.Api.DTOs.CommentDTOs
{
    public class CommentResultDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set; }
        public string Text { get; set; }
        public UserProfileDTO User { get; set; }
    }
}
