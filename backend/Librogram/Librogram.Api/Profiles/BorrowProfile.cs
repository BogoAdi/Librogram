using AutoMapper;
using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Api.DTOs.LibraryDTOs;
using Librogram.Application.Borrowings.cs.Commands;
using Librogram.Application.Libraries.Commands;
using Librogram.Domain;

namespace Librogram.Api.Profiles
{
    public class BorrowProfile : Profile
    {
        public BorrowProfile()
        {
            CreateMap<CreateBorrowingDto, Borrowing>();
            CreateMap<Borrowing, GetBorrowingDto>();
            CreateMap<Borrowing, GetBorrowingLibraryDto>().ReverseMap();

            //for the book controller
           /* CreateMap<Borrowing, GetBorrowingBookDetails>().ReverseMap();*/
        }
    }
}
