using Librogram.Dal;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.IntegrationTests
{
    public static class InMemoryDbContext
    {
        public static LibrogramContext GetInMemoryDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<LibrogramContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());
            return new LibrogramContext(optionsBuilder.Options);
        }
    }
}
