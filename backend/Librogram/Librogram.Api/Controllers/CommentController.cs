using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Librogram.Application.Comments.Queries;
using Librogram.Application.Comments.Commands;
using Librogram.Domain;
using Librogram.Api.DTOs.CommentDTOs;

namespace Librogram.Api.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public CommentController(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;

        }

        [HttpGet("/by-post/{id}")]
        public async Task<IActionResult> GetCommentsByPostId(Guid id)
        {
            var query = new GetCommentByPostIdQuery()
            {
                PostId = id
            };
            var result = await _mediator.Send(query);
            var mappedResult = _mapper.Map<List<CommentResultDTO>>(result);
            return Ok(mappedResult);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> EditPost(Guid id, [FromBody] PatchCommentBodyDTO patchedComment)
        {
            var editCommentCommand = new EditCommentCommand()
            {
                Id = id,
                UserId = patchedComment.UserId,
                Text = patchedComment.Text
            };

            var result = await _mediator.Send(editCommentCommand);

            var mappedResult = _mapper.Map<Comment, CommentResultDTO>(result);

            return Ok(mappedResult);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(Guid id, Guid userId)
        {

            var command = new RemoveCommentCommand
            {
                CommentId = id,
                UserId = userId
            };
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost(CreateCommentBodyDTO comment)
        {
            var command = new CreateCommentCommand()
            {
                Comment = new Comment { Text = comment.Text, PostId = comment.PostId, UserId = comment.UserId }
            };

            var created = await _mediator.Send(command);

            var mappedResult = _mapper.Map<Comment, CommentResultDTO>(created);

            return Ok(mappedResult);
        }


    }
}
