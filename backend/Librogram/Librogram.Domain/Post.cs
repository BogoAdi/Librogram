using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class Post
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public string ?Text { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set; }

        public List<Reaction> Reactions { get; set;} = new List<Reaction>();
        public List<Comment> Comments { get; set;} = new List<Comment>();
    }
}
