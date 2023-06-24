using AutoMapper;
using Librogram.Api.DTOs.BookDTOs;
using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Application.Books.Commands;
using Librogram.Domain;

namespace Librogram.Api.Profiles
{
    public class BookProfile : Profile
    {
        public BookProfile()
        {
            CreateMap<CreateBookDto, Book>();
            CreateMap<Book, GetBookResultDto>();
            CreateMap<UpdateBookDto, Book>();
            CreateMap<UpdateBookDto, UpdateBookCommand>().ReverseMap();
            //for the get mappers:
            CreateMap<Book, GetBookResultWithLibDto>().ReverseMap();
        }
    }
}
