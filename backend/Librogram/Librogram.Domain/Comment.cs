using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class Comment
    {
        public Guid Id { get; set; }

        public Guid PostId { get; set; } 
        public Post? Post { get; set; }

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public string? Text { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set;}

    }
}
