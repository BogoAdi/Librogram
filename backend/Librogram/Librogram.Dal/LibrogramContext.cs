using Librogram.Dal.EntityConfigurations;
using Librogram.Domain;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Librogram.Dal
{
    public class LibrogramContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Library> Libraries { get; set; }
        public DbSet<Borrowing> Borrowings { get; set; }

        public LibrogramContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new UserConfigurations());
            builder.ApplyConfiguration(new LibraryConfigurations());
            builder.ApplyConfiguration(new BookConfigurations());
            builder.ApplyConfiguration(new BorrowingConfigurations());
            builder.ApplyConfiguration(new ReactionConfiguration());
            builder.ApplyConfiguration(new PostConfigurations());
            builder.ApplyConfiguration(new CommentConfiguration());

            builder.Entity<User>()
          .HasMany(u => u.FavouriteBooks)
          .WithMany()
          .UsingEntity<Dictionary<string, object>>(
              "FavBooks",
              j => j
                  .HasOne<Book>()
                  .WithMany()
                  .HasForeignKey("BookId")
                  .OnDelete(DeleteBehavior.ClientCascade),
              j => j
                  .HasOne<User>()
                  .WithMany()
                  .HasForeignKey("UserId")
                  .OnDelete(DeleteBehavior.ClientCascade),
              j =>
              {
                  j.HasKey("UserId", "BookId");
                  j.ToTable("FavoriteBooks");
              });
        }
    }
}
