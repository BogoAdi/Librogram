using Librogram.Api.DTOs.UserDTOs;

namespace Librogram.Api.DTOs.ReactionDTOs
{
    public class GroupedReactionsResultDTO
    {
        public string Reaction { get; set; }

        public List<UserProfileDTO> PeopleThatReactedThatWay { get; set; }
        public int Count { get; set; }
    }
}
