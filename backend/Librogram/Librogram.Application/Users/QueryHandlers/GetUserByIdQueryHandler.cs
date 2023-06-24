using Librogram.Application.Exceptions;
using Librogram.Application.Users.Queries;
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
using Tavis.UriTemplates;


namespace Librogram.Application.Users.QueryHandlers
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDetails>
    {
        private readonly LibrogramContext _context;

        public GetUserByIdQueryHandler(LibrogramContext context)
        {
            _context = context;
        }

        public async Task<UserDetails> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var found = await _context.Users.Include(x => x.PersonalLibrary)
                                              .Include(x => x.FollowedLibraries)
                                              .Include(x => x.Friends)
                                              .Include(x => x.Borrowings)
                                              .Include(x => x.Posts)
                                              .Include(x => x.FavouriteBooks)
                                            .FirstOrDefaultAsync(x => x.Id == request.Id);
            if (found == null) throw new HttpResponseException(HttpStatusCode.NotFound, "this user doesn't exists in the app");
            List<User> listFound = new List<User>();
            listFound.Add(found);
            var converted = utils.UserDetailsUtil.GetUserDetails(listFound);
            return converted.First();
        }
    }
}
