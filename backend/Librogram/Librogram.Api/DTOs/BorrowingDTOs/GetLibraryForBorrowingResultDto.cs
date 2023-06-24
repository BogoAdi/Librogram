namespace Librogram.Api.DTOs.BorrowingDTOs
{
    public class GetLibraryForBorrowingResultDto
    {
        public string? Name { get; set; }
        public bool? IsPublic { get; set; }
        public string Location { get; set; }
        public int NumberOfBooks { get; set; }
    }
}
