using Librogram.Api.DTOs.UserDTOs;

namespace Librogram.Api.DTOs.PostControllerDTOs
{
    public class PostOnlyDetailsDTO
    {
        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set; }
        public string Text { get; set; }
        public UserProfileDTO ProfileDTO { get; set; }
        public int CommentsCount { get; set; }
        public int ReactionsCount { get; set; }
    }
}
