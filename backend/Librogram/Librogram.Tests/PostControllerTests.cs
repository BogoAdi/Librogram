using AutoMapper;
using CorporateSocialNetwork.Api.Controllers;
using Librogram.Api.DTOs.PostControllerDTOs;
using Librogram.Application.Posts.Commands;
using Librogram.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Librogram.Tests
{
    public class PostControllerTests
    {
        private readonly Mock<IMediator> _mockMediator = new Mock<IMediator>();
        private readonly Mock<IMapper> _mockMapper = new Mock<IMapper>();

        [Fact]
        public async Task Post_Create_Posts_Is_Called()
        {
            //Arrange
            var fakeId = Guid.NewGuid();
            var fakeUserId = Guid.NewGuid();
            var post = new Post
            {
                Id = fakeId,
                UserId = fakeUserId
            };

            _mockMediator
                .Setup(m => m.Send(It.IsAny<CreatePostCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(post)
                .Verifiable();
            var controller = new PostsController(_mockMapper.Object, _mockMediator.Object);
            //Act
            await controller.CreatePost(new CreatePostBodyDTO());
            //Assert
            _mockMediator.Verify(x => x.Send(It.IsAny<CreatePostCommand>(), It.IsAny<CancellationToken>()), Times.Once());
        }

        [Fact]
        public async Task Post_Create_ShouldReturn_OkStatus()
        {
            //Arrange
            var fakeUserId = Guid.NewGuid();
            var post = new CreatePostBodyDTO
            {
                Text = "dummy test",
                UserId = fakeUserId
            };
            _mockMediator
                .Setup(m => m.Send(It.IsAny<CreatePostCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new Post())
                .Verifiable();
            //Act
            var controller = new PostsController(_mockMapper.Object, _mockMediator.Object);
            var result = await controller.CreatePost(post);
            //Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Post_Create_ResultShouldBeOfTypePostPostResultDTO()
        {
            //Arrange
            var fakeUserUd = Guid.NewGuid();
            var postDTO = new CreatePostBodyDTO
            {
                Text = "dummy test",
                UserId = fakeUserUd
            };
            _mockMediator
                .Setup(m => m.Send(It.IsAny<CreatePostCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new Post());
            _mockMapper
               .Setup(m => m.Map<Post, CreatePostResultDTO>(It.IsAny<Post>()))
               .Returns(new CreatePostResultDTO());

            //Act
            var controller = new PostsController(_mockMapper.Object, _mockMediator.Object);
            var result = await controller.CreatePost(postDTO);
            var okResult = result as OkObjectResult;

            //Assert
            Assert.NotNull(okResult);
            Assert.IsType<CreatePostResultDTO>(okResult.Value);
        }
    }
}