using Swashbuckle.AspNetCore.SwaggerGen;

namespace <%= projectName %>.Filters
{
    internal class ContentTypeOperationFilter : IOperationFilter
    {
        public void Apply(Swashbuckle.AspNetCore.Swagger.Operation operation, OperationFilterContext context)
        {
            operation.Produces.Clear();
            operation.Produces.Add("application/vnd.api+json");
            operation.Consumes.Clear();
            operation.Consumes.Add("application/vnd.api+json");
        }
    }
}
