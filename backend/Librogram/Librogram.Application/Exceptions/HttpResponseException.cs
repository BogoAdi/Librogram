using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Librogram.Application.Exceptions
{
    public class HttpResponseException : Exception
    {
        public HttpResponseException(HttpStatusCode statusCode, string message) =>
            (StatusCode, ErrorMessage) = (statusCode, message);

        public HttpStatusCode StatusCode { get; }

        public string ErrorMessage { get; }
    }
}
