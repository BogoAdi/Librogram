
using AutoMapper;
using Librogram.Api.DTOs.PostControllerDTOs;
using Librogram.Application;
using Librogram.Application.Posts.Commands;
using Librogram.Application.Posts.Queries;
using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CorporateSocialNetwork.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public PostsController(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;

        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var getAllPostsQuery = new GetAllPostsQuery();

            var result = await _mediator.Send(getAllPostsQuery);

            var mappedResult = _mapper.Map<List<PostResultDTO>>(result);

            return Ok(mappedResult);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(Guid id)
        {
            var getPostByIdQuery = new GetPostByIdQuery() { Id = id };

            var result = await _mediator.Send(getPostByIdQuery);

            var mappedResult = _mapper.Map<PostDetails,PostResultDTO>(result);

            return Ok(mappedResult);
        }


        [HttpPatch("{id}")]
        public async Task<IActionResult> EditPost(Guid id, [FromBody] PatchPostTextBodyDTO textDTO)
        {
            var editPostCommand = new EditPostCommand()
            {
                Id = id,
                UserId = textDTO.UserId,
                Text = textDTO.Text
            };

            var result = await _mediator.Send(editPostCommand);

            var mappedResult = _mapper.Map<Post, CreatePostResultDTO>(result);

            return Ok(mappedResult);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id, Guid userId)
        {
           

            var command = new RemovePostCommand
            {
                Id = id,
                UserId = userId
            };

            await _mediator.Send(command);
             
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost(CreatePostBodyDTO post)
        {
            var command = _mapper.Map<CreatePostBodyDTO, CreatePostCommand>(post);

            var created = await _mediator.Send(command);

            var mappedResult = _mapper.Map<Post, CreatePostResultDTO>(created);

            return Ok(mappedResult);
        }

        [HttpGet]
        [Route("of-user/{id}")]
        public async Task<IActionResult> GetAllPostsByUserId(Guid id)
        {
            var query = new GetPostsByUserIdQuery()
            {
                UserId = id
            };
            var result = await _mediator.Send(query);
            var mappedResult = _mapper.Map<List<PostDetails>,List<PostResultDTO>>(result);

            return Ok(mappedResult);
        }
    }
}