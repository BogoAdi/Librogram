using AutoMapper;
using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.ReactionDTOs;
using Librogram.Application;
using Librogram.Application.Reactions.Commands;
using Librogram.Domain;

namespace Librogram.Api.Profiles
{
    public class ReactionProfile : Profile
    {
        public ReactionProfile()
        {
            CreateMap<CreatePostReactionBodyDTO, CreateOrUpdateReactionCommand>()
              .ReverseMap();
            CreateMap<Reaction, PostReactionResultDTO>()
                .ForMember(postReactionDto=> postReactionDto.Reaction, opt=>opt.MapFrom(reaction => reaction.Emote))
                .ForMember(postReactionDto => postReactionDto.User, opt => opt.MapFrom(postReaction => postReaction.User))
                .ForPath(postReactionDto => postReactionDto.User.UserId, opt => opt.MapFrom(postReaction => postReaction.User.Id))
                .ReverseMap();
            CreateMap<GroupedReactions, GroupedReactionsResultDTO>()
                .ForMember(postReactionDto => postReactionDto.Reaction, opt => opt.MapFrom(reaction => reaction.Emote))
                .ReverseMap();
            CreateMap<Reaction, ReactionDetails>()
                .ForMember(pr => pr.Reaction, opt => opt.MapFrom(rd => rd.Emote)).ReverseMap();
        }
    }
}
