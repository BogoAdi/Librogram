
using static Librogram.Api.DTOs.ReactionDTOs.CustomDataAnnotations;

namespace Librogram.Api.DTOs.ReactionDTOs
{
    public class CreatePostReactionBodyDTO
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        [ContainedInEnum]
        public string Reaction { get; set; }
    }
}
