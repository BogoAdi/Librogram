using Librogram.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Dal.EntityConfigurations
{
    public class UserConfigurations : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasMany(x => x.Posts)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.ClientCascade);

            builder.HasMany(x => x.Comments)
             .WithOne(x => x.User)
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.ClientCascade);


            builder.HasMany(x => x.Reactions)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.ClientCascade);


            builder.HasMany(f => f.Friends)
                     .WithMany()
                     .UsingEntity<Dictionary<string, object>>(
                         "UserFriends",
                         j => j
                             .HasOne<User>()
                             .WithMany()
                             .HasForeignKey("UserId")
                             .OnDelete(DeleteBehavior.ClientCascade),
                         j => j
                             .HasOne<User>()
                             .WithMany()
                             .HasForeignKey("FriendUserId")
                             .OnDelete(DeleteBehavior.ClientCascade),
                         j =>
                         {
                             j.HasKey("UserId", "FriendUserId");
                             j.HasIndex("FriendUserId");
                         });

        }
    }
}
