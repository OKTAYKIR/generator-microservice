using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace <%= projectName %>.Services
{
    public class <%= microserviceKey %>Service : ICreateService<<%= requestModelName %>, <%= responseModelName %>, string>,
                                                  IDeleteService<<%= requestModelName %>, string>
    {
        #region Properties
        readonly IHttpContextAccessor _contextAccessor;

        UserSessionResource UserIdentity { get { return _contextAccessor.HttpContext.Items["User"] as UserSessionResource; } }
        #endregion

        private readonly ILogger _logger;

        public <%= microserviceKey %>Service(IHttpContextAccessor contextAccessor, 
                                              ILogger<<%= microserviceKey %>Service> logger)
        {
            _logger = logger;

            _contextAccessor = contextAccessor;
        }

        public async Task<<%= responseModelName %>> CreateAsync(<%= requestModelName %> model)
        {
            return new <%= responseModelName %>();
        }

        public async Task<bool> DeleteAsync(string id)
        {
            return true;            
        }
    }
}