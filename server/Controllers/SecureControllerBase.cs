using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DMInsights.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class SecureControllerBase : ControllerBase
    {
        protected string UserId => User.FindFirst(x => x.Type == "uid").Value;
    }
}