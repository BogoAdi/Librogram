using AutoMapper;
using Librogram.Api.DTOs.ReactionDTOs;
using Librogram.Application.Reactions.Commands;
using Librogram.Application.Reactions.Queries;
using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Librogram.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ReactionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;
        public ReactionController(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePostReaction(CreatePostReactionBodyDTO postReaction)
        {
            var command = _mapper.Map<CreatePostReactionBodyDTO, CreateOrUpdateReactionCommand>(postReaction);

            var result = await _mediator.Send(command);
            var mappedResult = _mapper.Map<Reaction, PostReactionResultDTO>(result);

            return Ok(mappedResult);
        }


        [HttpGet]
        [Route("of-post/{postId}")]
        public async Task<IActionResult> GetAllReactionsForPost(Guid postId)
        {
            var query = new GetReactionsOfPostQuery()
            {
                PostId = postId
            };

            var result = await _mediator.Send(query);
            var mappedResult = _mapper.Map<List<Reaction>, List<PostReactionResultDTO>>(result);
            return Ok(mappedResult);
        }

        [HttpDelete("{postId}")]
        public async Task<IActionResult> DeletePostReaction(Guid postId, Guid userId)
        {
           
            var command = new RemoveReactionCommand() 
            {
                PostId = postId,
                UserId = userId
            };

            var result = await _mediator.Send(command);

            return NoContent();
        }

        [HttpGet("grouped-reactions/{id}")]
        public async Task<IActionResult> GetGroupedPostReactions(Guid id)
        {
            var query = new GetGroupedReactionByPostIdQuery()
            {
                PostId = id
            };

            var result = await _mediator.Send(query);

            var mappedResult = _mapper.Map<List<GroupedReactionsResultDTO>>(result);

            return Ok(mappedResult);
        }
    }
}
