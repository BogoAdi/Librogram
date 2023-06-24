using AutoMapper;
using Librogram.Api.DTOs.BorrowingDTOs;
using Librogram.Api.DTOs.LibraryDTOs;
using Librogram.Application;
using Librogram.Application.Libraries.Commands;
using Librogram.Domain;

namespace Librogram.Api.Profiles
{
    public class LibraryProfile : Profile
    {
        public LibraryProfile() 
        {
            CreateMap<UpdateLibraryDto, UpdateLibraryCommand>();
            CreateMap<CreateLibraryDto, CreateLibraryCommand>();
            CreateMap<Library, GetLibraryForBorrowingResultDto>();


            CreateMap<Library, GetOnlyLibraryDetails>().ReverseMap();

            CreateMap<LibraryDetails, GetLibraryDetailsDto>().ReverseMap();
            
            CreateMap<Library, GetLibraryDetailsDto>().ReverseMap();

            //for add and remove book
            
            CreateMap<LibraryBooksDetails,GetLibraryDetailsDto>().ReverseMap();
        }
    }
}
