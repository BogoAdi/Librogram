
using Librogram.Api.DTOs.CommentDTOs;
using Librogram.Api.DTOs.UserDTOs;
using Librogram.Application;

namespace Librogram.Api.DTOs.PostControllerDTOs
{
    public class PostResultDTO
    {
        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set; }
        public string Text { get; set; }
        public UserProfileDTO ProfileDTO { get; set; }
        public int CommentsCount { get; set; }
        public ICollection<CommentResultDTO> Comments { get; set; }
        public ICollection<ReactionDetails> Reactions { get; set; }
    }
}
