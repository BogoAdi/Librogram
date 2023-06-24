using Librogram.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application
{
    public class GroupedReactions
    {
            public EmoteReaction Emote { get; set; }
            public int Count { get; set; }
            public List<User> PeopleThatReactedThatWay { get; set; }
    }
}
