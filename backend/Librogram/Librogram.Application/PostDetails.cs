using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application
{
    public class PostDetails
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set; }
        public string Text { get; set; }
        public int CommentsCount { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<ReactionDetails> Reactions { get; set; }
    }
}
