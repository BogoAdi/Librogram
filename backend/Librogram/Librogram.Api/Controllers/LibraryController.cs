using AutoMapper;
using Librogram.Api.DTOs.LibraryDTOs;
using Librogram.Application.Libraries.Commands;
using Librogram.Application.Libraries.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Librogram.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class LibraryController : ControllerBase
    {
        public readonly IMediator _mediator;
        public readonly IMapper _mapper;
        public LibraryController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;

        }
        [HttpPost]
        public async Task<IActionResult> CreateLibrary(IFormFile file , [FromForm] CreateLibraryDto libraryCommand)
        {
            var mapped = _mapper.Map<CreateLibraryCommand>(libraryCommand);
            mapped.File= file;
            var created = await _mediator.Send(mapped);
            var resultMapped = _mapper.Map<GetLibraryDetailsDto>(created);
            return Ok(resultMapped);
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteLibrary(RemoveLibraryCommand libraryCommand)
        {
            await _mediator.Send(libraryCommand);
            return NoContent();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllLibraries()
        {
            var result = await _mediator.Send(new GetAllLibrariesQuery());
            var mappedResult = _mapper.Map<List<GetLibraryDetailsDto>>(result);
            return Ok(mappedResult);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLibraryById(Guid id)
        {
            var library = new GetLibraryByIdQuery { Id = id };
            var result = await _mediator.Send(library);
            var mappedResult = _mapper.Map<GetLibraryDetailsDto>(result);
            return Ok(mappedResult);
        }
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetLibraryByOwnerId(Guid id)
        {
            var library = new GetLibraryByOwnerIdQuery { Id = id };
            var result = await _mediator.Send(library);
            var mappedResult = _mapper.Map<GetLibraryDetailsDto>(result);
            return Ok(mappedResult);
        }
        [HttpPatch("{id}")]
        public async Task<IActionResult> EditLibrary(Guid id, [FromForm] UpdateLibraryDto updateLibrary)
        {
            //id-ul din token :D TDL

            var mappedInput = _mapper.Map<UpdateLibraryCommand>(updateLibrary);
            mappedInput.Id = id;
            var result = await _mediator.Send(mappedInput);
            var mappedResult = _mapper.Map<GetLibraryDetailsDto>(result);
            return Ok(mappedResult);
        }
        [HttpPost("{id}/addbook/{bookid}")]
        public async Task<IActionResult> AddBookToLibrary(Guid id, Guid bookid)
        {
            var addBookCommand = new AddBookToLibraryCommand
            {
                Id = id,
                BookId = bookid
            };
            var result = await _mediator.Send(addBookCommand);
            var mappedResult = _mapper.Map<GetLibraryDetailsDto>(result);
            return Ok(mappedResult);
        }
        [HttpDelete("{id}/removebook/{bookid}")]
        public async Task<IActionResult> RemoveBookFromLibrary(Guid id, Guid bookid)
        {
            var removeBookFromLibrary = new RemoveBookFromLibraryCommand
            {
                Id = id,
                BookId = bookid
            };
            var result = await _mediator.Send(removeBookFromLibrary);
            var mappedResult = _mapper.Map<GetLibraryDetailsDto>(result);
            return Ok(mappedResult);
        }
        [HttpPatch("follow")]
        public async Task<IActionResult> FollowLibrary(bool option, Guid libraryId, Guid personalId)
        {
            var result = await _mediator.Send(new FollowLibraryCommand()
            {
                Follow = option,
                LibraryId = libraryId,
                PersonalUserId = personalId
            });
            return Ok(result);
        }
    }
}
