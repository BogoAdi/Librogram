using Librogram.Domain;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Librogram.Application.Posts.Commands
{
    public class RemovePostCommand : IRequest<bool>
    {
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

    }
}
