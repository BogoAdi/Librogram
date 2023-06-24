﻿using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.Queries
{
    public class SearchByAuthorQuery : IRequest<List<Book>>
    {
        public string Author { get; set; }
        public Guid LibraryId { get; set; }
    }
}
