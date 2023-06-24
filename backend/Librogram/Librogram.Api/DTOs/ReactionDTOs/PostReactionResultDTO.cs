using Librogram.Api.DTOs.UserDTOs;

namespace Librogram.Api.DTOs.ReactionDTOs
{
    public class PostReactionResultDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public UserProfileDTO? User { get; set; }
        public string? Reaction { get; set; }
    }
}
