using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMInsights.Data;
using DMInsights.Models;
using DMInsights.Models.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DMInsights.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : SecureControllerBase
    {
        readonly UsersRepository _usersRepo;

        public UsersController(UsersRepository userRepo)
        {
            _usersRepo = userRepo;
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
