using AutoMapper;
using Librogram.Api.DTOs.BookDTOs;
using Librogram.Application.Books.Commands;
using Librogram.Application.Books.Queries;
using Librogram.Application.Libraries.Commands;
using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tavis.UriTemplates;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Librogram.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        public readonly IMediator _mediator;
        public readonly IMapper _mapper;
        public BookController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<IActionResult> CreateBook([FromForm] CreateBookDto bookDto)
        {
            var mapped = _mapper.Map<Book>(bookDto);
            var command = new CreateBookCommand { Book = mapped, File = bookDto.File };
            var created = await _mediator.Send(command);
            return Ok(created);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var command = new RemoveBookCommand
            {
                Id = id
            };
            await _mediator.Send(command);
            return NoContent();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllBooks(bool takeDublicates)
        {
            var result = await _mediator.Send(new GetAllBooksQuery { Dublicates = takeDublicates });
            var mappedResult = _mapper.Map<List<GetBookResultWithLibDto>>(result);
            return Ok(mappedResult);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = new GetBookByIdQuery { Id = id };
            var result = await _mediator.Send(book);
            var mappedResult = _mapper.Map<GetBookResultWithLibDto>(result);
            return Ok(mappedResult);
        }
        [HttpPatch("{id}")]
        public async Task<IActionResult> EditBook(Guid id, [FromForm] UpdateBookDto updateBook)
        {
            var mappedInput = _mapper.Map<UpdateBookCommand>(updateBook);
            mappedInput.UniqueBookId = id;
            var result = await _mediator.Send(mappedInput );
            return Ok(result);
        }
        [HttpGet("/from/library/{id}")]
        public async Task<IActionResult> GetBooksFromLibraryById(Guid id, bool isExtended)
        {
            var query = new GetBooksFromLibrariesQuery { LibraryId = id, isExtended = isExtended };
            var result = await _mediator.Send(query);
            var mappedResult = _mapper.Map<List<GetBookResultWithLibDto>>(result);
            return Ok(mappedResult);
        }
        [HttpGet("search-by-author/")]
        public async Task<IActionResult> SearchBooksByAuthor([FromQuery(Name = "author")] string name, [FromQuery(Name = "library-id")] Guid libraryId)
        {
            var query = new SearchByAuthorQuery { Author = name, LibraryId = libraryId };
            var results = await _mediator.Send(query);
            var mappedResult = _mapper.Map<List<GetBookResultWithLibDto>>(results);
            return Ok(mappedResult);
        }
        [HttpGet("search-by-title/")]
        public async Task<IActionResult> SearchBooksByTitle([FromQuery(Name = "title")] string name, [FromQuery(Name = "library-id")] Guid libraryId)
        {
            var query = new SearchByTitleQuery { Title = name, LibraryId = libraryId };
            var results = await _mediator.Send(query);
            var mappedResult = _mapper.Map<List<GetBookResultWithLibDto>>(results);
            return Ok(mappedResult);
        }
        [HttpPatch("set-as-favourite")]
        public async Task<IActionResult> SetFavouriteBook(bool option, Guid bookId, Guid personalId)
        {
            var result = await _mediator.Send(new SetBookAsFavouriteCommand()
            {
                SetFavourite = option,
                BookId = bookId,
                UserId = personalId
            });
            return Ok(result);
        }
    }
}
