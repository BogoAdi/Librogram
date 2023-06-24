
using Librogram.Domain;
using System.ComponentModel.DataAnnotations;

namespace Librogram.Api.DTOs.ReactionDTOs
{
    public class CustomDataAnnotations
    {
        public class ContainedInEnum : ValidationAttribute
        {
            public override bool IsValid(object value)
            {
                if (Enum.IsDefined(typeof(EmoteReaction), value))
                    return true;
                return false;
            }
        }
    }
}
