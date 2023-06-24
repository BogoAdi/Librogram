using AutoMapper;
using Librogram.Api.DTOs.PostControllerDTOs;
using Librogram.Application;
using Librogram.Application.Posts.Commands;
using Librogram.Domain;

namespace CorporateSocialNetwork.Api.Profiles
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<CreatePostBodyDTO, CreatePostCommand>()
                .ForPath(postDto => postDto.Post.UserId, opt => opt.MapFrom(command => command.UserId))
                .ForPath(postDto => postDto.Post.Text, opt => opt.MapFrom(command => command.Text));
            CreateMap<PostDetails, PostResultDTO>()
                .ForMember(result => result.ProfileDTO, opt=>opt.MapFrom(postDto => postDto.User))
                .ReverseMap();
            CreateMap<Post, PostOnlyDetailsDTO>().ReverseMap();
            CreateMap<Post, PostResultDTO>()
                .ForMember(postDTO => postDTO.ProfileDTO, opt => opt.MapFrom(post => post.User))
                .ForPath(postDTO => postDTO.ProfileDTO.UserId, opt => opt.MapFrom(post => post.UserId))
                .ReverseMap();
            CreateMap<Post, CreatePostResultDTO>();
        }
    }
}
