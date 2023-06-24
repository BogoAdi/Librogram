﻿using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Comments.Queries
{
    public class GetCommentByPostIdQuery : IRequest<List<Comment>>
    {
        public Guid PostId { get; set; }
    }
}
