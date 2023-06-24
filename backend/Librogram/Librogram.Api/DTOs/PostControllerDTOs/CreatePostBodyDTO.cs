using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Librogram.Api.DTOs.PostControllerDTOs
{
    public class CreatePostBodyDTO
    {

        [MinLength(1)]
        public string Text { get; set; }
        public Guid UserId { get; set; }
    }
}
