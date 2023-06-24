using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.utils
{
    public class LibraryBooksDetailsUtil
    {
        public static List<LibraryBooksDetails> GetLibraryDetails(ICollection<Library> libs)
        {
            if (libs == null)
            {
                return null;
            }

            var librariesDetails = new List<LibraryBooksDetails>();

            foreach (var lib in libs)
            {
                librariesDetails.Add(ConvertToLibDetails(lib));
            }

            return librariesDetails;
        }

        public static LibraryBooksDetails ConvertToLibDetails(Library library)
        {
            if (library == null)
            {
                return null;
            }

            var libDetails = new LibraryBooksDetails
            {
                Id = library.Id,
                Name = library.Name,
                Books = library.Books,
                IsPublic = library.IsPublic,
                Location = library.Location,
                ProfileImage = library.ProfileImage,
                Owner = library.Owner,
                OwnerId = library.OwnerId,
                NumberOfBooks = library.Books.Count

            };

            return libDetails;
        }
    }
}
