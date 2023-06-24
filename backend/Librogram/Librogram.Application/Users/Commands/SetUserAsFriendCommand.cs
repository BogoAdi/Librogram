using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Users.Commands
{
    public class SetUserAsFriendCommand : IRequest<bool>
    {
        public Guid PersonalUserId { get; set; }
        public Guid UserId { get; set; }
        public bool SetAsFriend { get; set; }
    }
}
