using Librogram.Dal;
using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.IntegrationTests
{
    public static class InMemoryDatabase
    {
        public static void IntializeDbForTests(this LibrogramContext context)
        {
            var venues = new List<Book>()
            {
                new Book
                {
                    Status = StatusValues.Available,
                    Author = "Mihai Eminescu",
                    Category = "Literature",
                    Id = new Guid("68c6016f-3fa6-4519-a40b-269f3790048d"),
                    PdfFormat = false,
                    Title = "Poems",
                    LibraryId = new Guid("1e338dbf-9169-4e34-9d17-90bca6d81430"),
                    UniqueBookId = new Guid("04397fbf-7ce4-482c-8299-a2d21dac99a8"),
                    Borrowings = new List<Borrowing>()
                },
                new Book
                {
                    Status = StatusValues.Borrowed,
                    Author = "J. R. R. Tolkien",
                    Category = "fantasy",
                    Title = "Lord of the Rings",
                    Id = new Guid(),
                    LibraryId = new Guid(),
                    UniqueBookId = new Guid(),
                    Borrowings = new List<Borrowing>(),
                    PdfFormat = false,
                }
            };
            context.Books.AddRange(venues);
            context.SaveChanges();

            var listOfLibraries = new List<Library>()
            {
                new Library
                {
                    Books= new List<Book>(),
                    Borrowings= new List<Borrowing>(),
                    Id= new Guid("27546e4e-ae45-45ee-bbe1-aba17593b79e"),
                    Location = "Timisoara",
                    Name = "LirbaryId",
                    OwnerId = new Guid("bfb92627-6a99-45eb-9a9b-dc7f6907c8a5"),
                    ProfileImage= "sample image",
                    IsPublic= true
                }
            };
            context.Libraries.AddRange(listOfLibraries);
            context.SaveChanges();

            var listOfUsers = new List<User>()
            {
                new User
                {
                    Borrowings= new List<Borrowing>(),
                    Comments= new List<Comment>(),
                    Email = "dummyemail@yahoo.com",
                    Name = "steve",
                    ProfilePicture = "data:image/jpeg;base64,",
                    Id= new Guid("b4fa3771-3fc5-4e47-bb3b-d883ff6eb718"),
                    Posts= new List<Post>(),
                    Friends = new List<User>(),
                    FavouriteBooks = new List<Book>(),
                    FollowedLibraries= new List<Library>(),
                    PersonalLibrary = new Library{ },
                    PersonalLibraryId= new Guid("27546e4e-ae45-45ee-bbe1-aba17593b79e"),
                    Reactions = new List<Reaction>()
                }
            };
            context.Users.AddRange(listOfUsers);
            context.SaveChanges();

            var postsList = new List<Post>()
            {
                new Post
                {
                    Comments= new List<Comment>(),
                    CreationDate= DateTime.Now,
                    Id= new Guid("2a0381e3-5e44-45dc-abfa-425b34197344"),
                    LastEditDate= DateTime.Now,
                    Text = "dummy text",
                    Reactions= new List<Reaction>(),
                    UserId =new Guid("b4fa3771-3fc5-4e47-bb3b-d883ff6eb718")
                },
                new Post
                {
                    Comments= new List<Comment>(),
                    CreationDate= DateTime.Now.AddDays(-1),
                    Id= new Guid("d8d3a4be-2488-4efa-9e86-c891cae251e2"),
                    LastEditDate= DateTime.Now.AddDays(-1),
                    Text = "dummy text",
                    Reactions= new List<Reaction>(),
                    UserId =new Guid("b4fa3771-3fc5-4e47-bb3b-d883ff6eb718")
                }
            };
            context.Posts.AddRange(postsList);
            context.SaveChanges();
        }
    }
}
