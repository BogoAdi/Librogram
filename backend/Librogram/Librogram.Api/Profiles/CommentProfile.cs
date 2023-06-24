using AutoMapper;
using Librogram.Api.DTOs.CommentDTOs;
using Librogram.Domain;

namespace Librogram.Api.Profiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<Comment, CommentResultDTO>();

        }
    }
}
