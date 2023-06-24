using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CorporateSocialNetwork.Application.utils
{
    public class PostTextRegex
    {
        public static string StripHTMLtags(string textWithHTML)
        {
            if (textWithHTML == null)
                return null;

            return Regex.Replace(textWithHTML, "<[^>]*>", string.Empty);

        }
    }
}
