using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class UserFriend 
    {
        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid FriendId { get; set; }
        public User? Friend { get; set; }
    }
}
