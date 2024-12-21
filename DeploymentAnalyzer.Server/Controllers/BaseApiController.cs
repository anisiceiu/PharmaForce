using DeploymentAnalyzer.Server.Filters;
using Microsoft.AspNetCore.Mvc;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [TypeFilter(typeof(AuthorizationFilterAttribute))]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
    }
}
