using Librogram.Application.Books.Commands;
using Librogram.Application.Exceptions;
using Librogram.Application.Posts.CommandHandlers;
using Librogram.Application.Posts.Commands;
using Librogram.Dal;
using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.IntegrationTests
{
    public class CreatePostTests
    {
        private readonly LibrogramContext _context;
        private readonly CreatePostCommandHandler _handler;

        public CreatePostTests()
        {
            _context = InMemoryDbContext.GetInMemoryDbContext();
            _handler = new CreatePostCommandHandler(_context);
        }
        [Fact]
        public async Task Handle_Invalid_UserId_ForPostCreation_ThrowsNotFound()
        {
            // Arrange
            
            var command = new CreatePostCommand
            {
                Post = new Post
                {
                    Text = "some text here",
                    UserId = Guid.NewGuid()
                }
            };
            // Act & Assert
            var exception = await Assert.ThrowsAsync<HttpResponseException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.Equal(HttpStatusCode.NotFound, exception.StatusCode);
        }
        [Fact]
        public async Task Handle_Empty_Text_ForPostCreation_ThrowsBadRequest()
        {
            // Arrange
            _context.IntializeDbForTests();
            var command = new CreatePostCommand
            {
                Post = new Post
                {
                    Text = string.Empty,
                    UserId = new Guid("b4fa3771-3fc5-4e47-bb3b-d883ff6eb718")
                }
            };
            // Act & Assert
            var exception = await Assert.ThrowsAsync<HttpResponseException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.Equal(HttpStatusCode.BadRequest, exception.StatusCode);
        }
        [Fact]
        public async Task Handle_TooManyChars_Text_ForPostCreation_ThrowsBadRequest()
        {
            // Arrange
            _context.IntializeDbForTests();
            var command = new CreatePostCommand
            {
                Post = new Post
                {
                    Text = string.Concat(Enumerable.Repeat("AA", 10000)),
                    UserId = new Guid("b4fa3771-3fc5-4e47-bb3b-d883ff6eb718")
                }
            };
            // Act & Assert
            var exception = await Assert.ThrowsAsync<HttpResponseException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.Equal(HttpStatusCode.BadRequest, exception.StatusCode);
        }
        [Fact]
        public async Task Handle_PostCreation()
        {
            // Arrange
            _context.IntializeDbForTests();
            var command = new CreatePostCommand
            {
                Post = new Post
                {
                    Text = "good message",
                    UserId = new Guid("b4fa3771-3fc5-4e47-bb3b-d883ff6eb718")
                }
            };
            // Act & Assert
            var createdPost = await _handler.Handle(command, CancellationToken.None);

            Assert.Equal(command.Post.Text, createdPost.Text);
            Assert.Equal(command.Post.UserId, createdPost.UserId);
        }
    }
}
