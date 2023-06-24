﻿using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.Commands
{
    public class FollowLibraryCommand : IRequest<bool>
    {
        public Guid PersonalUserId { get; set; }
        public Guid LibraryId { get; set; }
        public bool Follow { get; set; }
    }
}
