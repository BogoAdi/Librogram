using Librogram.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Dal.EntityConfigurations
{
    public class LibraryConfigurations : IEntityTypeConfiguration<Library>
    {
        public void Configure(EntityTypeBuilder<Library> builder)
        {
            builder.HasMany(l => l.Followers)
           .WithMany(u => u.FollowedLibraries)
           .UsingEntity<Dictionary<string, object>>(
               "LibraryFollowers",
               j => j.HasOne<User>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.ClientCascade),
               j => j.HasOne<Library>().WithMany().HasForeignKey("LibraryId").OnDelete(DeleteBehavior.ClientCascade),
               j =>
               {
                   j.HasKey("UserId", "LibraryId");
                   j.HasIndex("LibraryId");

               });


            builder.HasOne(x => x.Owner)
                   .WithOne(x => x.PersonalLibrary)
                   .HasForeignKey<Library>(l => l.OwnerId)
                   .OnDelete(DeleteBehavior.Cascade);


        }
    }
}
