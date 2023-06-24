using Librogram.Application.Libraries.Queries;
using Librogram.Application.utils;
using Librogram.Dal;
using Librogram.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Libraries.QueryHandlers
{
    public class GetAllLibrariesQueryHandler : IRequestHandler<GetAllLibrariesQuery, List<LibraryDetails>>
    {
        private readonly LibrogramContext _context;
        public GetAllLibrariesQueryHandler(LibrogramContext context)
        {
            _context = context;
        }


        public async Task<List<LibraryDetails>> Handle(GetAllLibrariesQuery request, CancellationToken cancellationToken)
        {
            var results =await _context.Libraries.Include(x=>x.Books)
                                                 .Include(x=>x.Followers)
                                                 .Include(x=>x.Owner)
                                                 .Include(x=>x.Borrowings)
                                                 .ToListAsync();
            return LibraryDetailsUtil.GetLibraryDetails(results);
        }
    }
}
