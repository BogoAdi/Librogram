using Librogram.Domain;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Dal.EntityConfigurations
{
    public class BookConfigurations : IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder)
        {
            builder.HasMany(x => x.Borrowings)
                .WithOne(x => x.Book)
                .HasForeignKey(x=>x.UniqueBookId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Library)
                    .WithMany(x => x.Books)
                    .HasForeignKey(x=>x.LibraryId)
                    .OnDelete(DeleteBehavior.Cascade);

            builder.HasKey(b => b.UniqueBookId);
            builder.HasIndex(b => b.Title);
            builder.HasIndex(b=>b.Author);
        }
    }
}
