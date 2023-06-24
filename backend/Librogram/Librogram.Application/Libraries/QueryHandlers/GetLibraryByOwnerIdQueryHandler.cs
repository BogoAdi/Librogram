using Librogram.Application.Exceptions;
using Librogram.Application.Libraries.Queries;
using Librogram.Application.utils;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.QueryHandlers
{
    public class GetLibraryByOwnerIdQueryHandler : IRequestHandler<GetLibraryByOwnerIdQuery, LibraryDetails>
    {
        private readonly LibrogramContext _context;
        public GetLibraryByOwnerIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }
        public async Task<LibraryDetails> Handle(GetLibraryByOwnerIdQuery request, CancellationToken cancellationToken)
        {
            var found = await _context.Libraries.Include(x => x.Books)
                                                  .Include(x => x.Followers)
                                                  .Include(x => x.Owner)
                                                  .Include(x => x.Borrowings).FirstOrDefaultAsync(x => x.OwnerId == request.Id);
            if (found == null) throw new HttpResponseException(HttpStatusCode.NotFound, "this user doesn't have a library!");
            List<Library> result = new List<Library>();
            result.Add(found);

            return LibraryDetailsUtil.GetLibraryDetails(result).First();
        }
    }
}
