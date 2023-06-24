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
    public class BorrowingConfigurations : IEntityTypeConfiguration<Borrowing>
    {
        public void Configure(EntityTypeBuilder<Borrowing> builder)
        {
            builder.HasOne(x=>x.Library)
                    .WithMany(x=>x.Borrowings)
                    .HasForeignKey(x=>x.LibraryId)
                    .OnDelete(DeleteBehavior.ClientCascade);

            builder.HasOne(x=>x.User)
                    .WithMany(x=>x.Borrowings)
                    .HasForeignKey(x=>x.UserId)
                    .OnDelete(DeleteBehavior.ClientCascade);


        }
    }
}
