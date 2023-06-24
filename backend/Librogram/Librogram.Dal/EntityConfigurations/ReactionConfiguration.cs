using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Librogram.Domain;

namespace Librogram.Dal.EntityConfigurations
{
    public class ReactionConfiguration : IEntityTypeConfiguration<Reaction>
    {
        public void Configure(EntityTypeBuilder<Reaction> builder)
        {
            builder.HasKey(x => new
            {
                x.UserId,
                x.PostId
            });

            builder.Property(e => e.Emote)
            .HasConversion(
            reaction => reaction.ToString(),
            reaction => (EmoteReaction)Enum.Parse(typeof(EmoteReaction), reaction));

        }
    }
}
