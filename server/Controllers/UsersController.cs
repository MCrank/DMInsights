using DMInsights.Data;
using DMInsights.Models.Users;
using Microsoft.AspNetCore.Mvc;

namespace DMInsights.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : SecureControllerBase
    {
        readonly UsersRepository _usersRepo;
        readonly CampaignsRepository _campaignsRepo;

        public UsersController(UsersRepository userRepo, CampaignsRepository campaignsRepo)
        {
            _usersRepo = userRepo;
            _campaignsRepo = campaignsRepo;
        }

        // GET: api/Users
        [HttpGet]
        public ActionResult<User> GetAllUsers()
        {
            var allUsers = _usersRepo.GetAllUsers();
            return Ok(allUsers);
        }

        // GET: api/Users/5
        [HttpGet("{id}", Name = "Get")]
        public ActionResult GetUserById(string id)
        {
            if (id != UserId)
            {
                return Unauthorized();
            }

            var user = _usersRepo.GetUserByIdToken(id);

            if (user == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(user);
            }
            //return Ok(user);
        }

        [HttpGet("{id}/campaigns")]
        public ActionResult GetUserCampaigns(int id)
        {
            var myCampaigns = _campaignsRepo.GetMyCampaigns(id);

            if (myCampaigns == null)
            {
                return NotFound();
            }
            return Ok(myCampaigns);
        }

        // POST: api/Users
        [HttpPost]
        public ActionResult<UserCreate> CreateUser([FromBody] UserCreate newUserObject)
        {
            var newUser = _usersRepo.CreateNewUser(newUserObject);
            return Ok(newUser);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
