using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.utils
{
    public class LibraryDetailsUtil
    {
        public static List<LibraryDetails> GetLibraryDetails(ICollection<Library> libs)
        {
            if (libs == null)
            {
                return null;
            }

            var librariesDetails = new List<LibraryDetails>();

            foreach (var lib in libs)
            {
                librariesDetails.Add(ConvertToLibDetails(lib));
            }

            return librariesDetails;
        }

        public static LibraryDetails ConvertToLibDetails(Library library)
        {
            if (library == null)
            {
                return null;
            }

            var libDetails = new LibraryDetails
            {
                Id = library.Id,
                Name = library.Name,
                Books = library.Books,
                Borrowings = library.Borrowings,
                ProfileImage = library.ProfileImage,
                Followers = library.Followers,
                IsPublic = library.IsPublic,
                Location = library.Location,
                Description= library.Description,
                Owner = library.Owner,
                OwnerId = library.OwnerId,
                NumberOfBooks = library.Books.Count,
                NumberOfFollowers = library.Followers.Count,
                TotalBorrowings = library.Borrowings.Count,
                ActiveBorrowings = library.Borrowings.Where(b => b.Status == BorrowStatus.Active).Count()

            };

            return libDetails;
        }
    }
}
