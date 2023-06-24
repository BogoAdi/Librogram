using AutoMapper;
using Librogram.Api.DTOs.UserDTOs;
using Librogram.Application.Users.Commands;
using Librogram.Application.Users.Queries;
using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tavis.UriTemplates;

namespace Librogram.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public UserController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser( [FromForm]CreateUserDTO user)
        {
            var mapped = _mapper.Map<User>(user);
            var created = await _mediator.Send(new CreateUserCommand { UserCommand = mapped, File = user.File });
            return Ok(created);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(RemoveUserCommand userCommand)
        {
            await _mediator.Send(userCommand);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = new GetUserByIdQuery { Id = id };
            var result = await _mediator.Send(user);
            var mappedResult = _mapper.Map<GetUserDetailsDto>(result);
            return Ok(mappedResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await _mediator.Send(new GetAllUsersQuery());
            var mappedResult = _mapper.Map<List<GetUserDetailsDto>>(result);
            return Ok(mappedResult);
        }
        [HttpPatch("{id}")]
        public async Task<IActionResult> EditUser(Guid id, [FromForm] UserPatchDTO info)
        {
            //id-ul din token :D TDL

            var result = await _mediator.Send(new UpdateUserCommand {File =  info.File, Id = id, Name =info.Name});
            return Ok(result);
        }
        [HttpPatch("follow")]
        public async Task<IActionResult> FollowUser(bool option, Guid userId, Guid personalId)
        {
            var result = await _mediator.Send(new SetUserAsFriendCommand() {
                SetAsFriend= option, 
                UserId = userId,
                PersonalUserId = personalId 
            });
            return Ok(result);
        }
    }
}
