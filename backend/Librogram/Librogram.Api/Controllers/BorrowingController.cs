using AutoMapper;
using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Application.Books.Commands;
using Librogram.Application.Books.Queries;
using Librogram.Application.Borrowings.Commands;
using Librogram.Application.Borrowings.cs.Commands;
using Librogram.Application.Borrowings.cs.Queries;
using Librogram.Application.Borrowings.Queries;
using Librogram.Application.Libraries.Commands;
using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Librogram.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class BorrowingController : ControllerBase
    {
        public readonly IMediator _mediator;
        public readonly IMapper _mapper;
        public BorrowingController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<IActionResult> CreateBorrowing(CreateBorrowingDto borrowingCommandDto)
        {
            var mapped = _mapper.Map<Borrowing>(borrowingCommandDto);
            var created = await _mediator.Send(new CreateBorrowingCommand { Borrowing = mapped});
            var finalCreated = _mapper.Map<GetBorrowingDto>(created);
            return Ok(finalCreated);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveBorrowing(Guid id)
        {
            var command = new RemoveBorrowingCommand
            {
                Id = id
            };
            var removed = await _mediator.Send(command);
            return Ok(removed);
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBorrowings()
        {
            var result = await _mediator.Send(new GetAllBorrowingsQuery());
            var mappedResult = _mapper.Map<List<GetBorrowingDto>>(result);
            return Ok(mappedResult);
        }
        [HttpGet("all/user/{id}")]
        public async Task<IActionResult> GetAllBorrowingsForUser(Guid id)
        {
            var result = await _mediator.Send(new GetAllBorrowingsByUserIdQuery { UserId = id });
            var mappedResult = _mapper.Map<List<GetBorrowingDto>>(result);
            return Ok(mappedResult);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBorrowingById(Guid id)
        {
            var result = await _mediator.Send(new GetBorrowingByIdQuery { Id = id }) ;
            var mappedResult = _mapper.Map<GetBorrowingDto>(result);
            return Ok(mappedResult);
        }
        [HttpPatch("{id}/set-status/${status}/user{userId}")]
        public async Task<IActionResult> SetBorrowingToReturnedStatus(Guid id, BorrowStatus status, Guid userId)
        {
            var result = await _mediator.Send(new SetBorrowingStatusCommand { Id = id, option= status, userId = userId});
            var mappedResult = _mapper.Map<GetBorrowingDto>(result);
            return Ok(mappedResult);
        }
    }
}
