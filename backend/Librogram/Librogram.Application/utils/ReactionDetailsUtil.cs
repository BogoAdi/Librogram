using Librogram.Application;
using Librogram.Domain;
namespace CorporateSocialNetwork.Application.utils
{
    public static class ReactionDetailsUtil
    {
        public static List<PostDetails> GetPostDetails(ICollection<Post> posts)
        {
            if (posts == null)
            {
                return null;
            }

            var postDetails = new List<PostDetails>();

            foreach (var post in posts)
            {
                postDetails.Add(ConvertToPostDetails(post));
            }

            return postDetails;
        }

        public static PostDetails ConvertToPostDetails(Post post)
        {
            if (post == null)
            {
                return null;
            }

            var postDetails = new PostDetails
            {
                Id = post.Id,
                UserId = post.UserId,
                User = post.User,
                CreationDate = post.CreationDate,
                LastEditDate = post.LastEditDate,
                Text = post.Text,
                CommentsCount = post.Comments.Count,
                Comments = post.Comments,
                Reactions = post.Reactions
                                    .GroupBy(x => x.Emote)
                                    .Select(x => new ReactionDetails
                                    {
                                        Reaction = x.Key.ToString(),
                                        Count = x.Count()
                                    }).ToList()
            };

            return postDetails;
        }
    }
}
