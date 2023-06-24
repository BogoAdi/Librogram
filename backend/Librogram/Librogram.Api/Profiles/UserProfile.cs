using AutoMapper;
using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.PostControllerDTOs;
using Librogram.Api.DTOs.UserDTOs;
using Librogram.Application;
using Librogram.Domain;

namespace Librogram.Api.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<CreateUserDTO, User>();
            CreateMap<UserProfileDTO, User>()
                .ForMember(user => user.Id, opt => opt.MapFrom(userprofile => userprofile.UserId))
                .ReverseMap();

            CreateMap<User, GetUserOnlyInfoDto>().ReverseMap();

            CreateMap<UserDetails, GetUserDetailsDto>().ReverseMap();
        }
    }
}
