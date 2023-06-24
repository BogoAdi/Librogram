using CorporateSocialNetwork.Application.utils;
using Librogram.Application.Users.Queries;
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

namespace Librogram.Application.Users.QueryHandlers
{
    public class GetAllUsersQueryHandler :IRequestHandler <GetAllUsersQuery, List<UserDetails>>
    {
        private readonly LibrogramContext _context;

        public GetAllUsersQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<List<UserDetails>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var result = await _context.Users.Include(x=>x.PersonalLibrary)
                                              .Include(x=>x.FollowedLibraries)
                                              .Include(x=>x.Friends)
                                              .Include(x=>x.Borrowings)
                                              .Include(x=>x.Posts)
                                              .Include(x=>x.FavouriteBooks)
                                             .ToListAsync();
            return UserDetailsUtil.GetUserDetails(result);
        }
    }
}
