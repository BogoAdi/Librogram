using Librogram.Application.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Librogram.Api.Filters
{
    public class HttpResponseExceptionFilter : IAsyncExceptionFilter
    {
        public Task OnExceptionAsync(ExceptionContext context)
        {
            if (context.ExceptionHandled) return Task.CompletedTask;

            if (context.Exception is not HttpResponseException httpResponseException) return Task.CompletedTask;
            var responseBody = httpResponseException.ErrorMessage;

            context.Result = new ObjectResult(responseBody)
            {
                StatusCode = (int)httpResponseException.StatusCode
            };

            context.ExceptionHandled = true;

            return Task.CompletedTask;
        }
    }
}
