using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Domain
{
    public class LibraryUser
    {
        public Guid LibraryId { get; set; }
        public Library? Library { get; set; }

        public Guid UserId { get; set; }
        public User? User { get; set; }
        public List<Library>? FollowedLibraries { get; set; }
        public List<User>? Followers { get; set; }
    }
}
