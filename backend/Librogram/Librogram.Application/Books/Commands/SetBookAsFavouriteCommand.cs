using Librogram.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Books.Commands
{
    public class SetBookAsFavouriteCommand : IRequest<bool>
    {
        public Guid UserId { get; set; }
        public Guid BookId { get; set; }
        public bool SetFavourite { get; set; }
    }
}
