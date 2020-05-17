using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JsonApiDotNetCore.Models;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace <%= projectName %>.Controllers
{
    public class <%= controllerName %> : BaseController<<%= requestModelName %>,
														<%= responseModelName %>,
														string>
    {
        private readonly ILogger _logger;

        public <%= controllerName %>(IJsonApiContext jsonApiContext,
                                    ICreateService<<%= requestModelName %>, <%= responseModelName %>, string> createService,
                                    IDeleteService<<%= requestModelName %>, string> deleteService,
                                    ILogger<<%= controllerName %>> logger
        )
        : base(jsonApiContext,
               create: createService,
               delete: deleteService)
        {
            _logger = logger;
        }

        [HttpGet("{id}")]
		[Authorize(AuthorizationType.<%= authorizationRole %>)]
        public override async Task<Object> GetAsync(string id)
        {
            return await base.GetAsync(id);
        }

        [HttpGet]
		[Authorize(AuthorizationType.<%= authorizationRole %>)]
        public override async Task<object> GetAsync()
        {
            return await base.GetAsync();
        }

        [HttpPost]
        [Authorize(AuthorizationType.<%= authorizationRole %>)]
        public override async Task<Object> PostAsync([FromBody] <%= requestModelName %> model)
        {
            var responseModel = (<%= responseModelName %>) await base.PostAsync(model);

            return Created($"{HttpContext.Request.Path}", responseModel);
        }

        [HttpDelete("{id}")]
		[Authorize(AuthorizationType.<%= authorizationRole %>)]
        public override async Task<Object> DeleteAsync(string id)
        {
            await base.DeleteAsync(id);

            return NoContent();
        }

        #region swagger ignore
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("{id}/relationships/{relationshipName}")]
        public override async Task<object> GetRelationshipsAsync(string id, string relationshipName)
        {
            return await base.GetRelationshipsAsync(id, relationshipName);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("{id}/{relationshipName}")]
        public override async Task<object> GetRelationshipAsync(string id, string relationshipName)
        {
            return await base.GetRelationshipAsync(id, relationshipName);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPatch("{id}/relationships/{relationshipName}")]
        public override async Task<object> PatchRelationshipsAsync(string id, string relationshipName,
            [FromBody] List<DocumentData> relationships)
        {
            return await base.PatchRelationshipsAsync(id, relationshipName, relationships);
        }
        #endregion
    }
}