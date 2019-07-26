using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMInsights.Data;
using DMInsights.Models.NonPlayerCharacters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DMInsights.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NonPlayerCharactersController : SecureControllerBase
    {
        readonly NonPlayerCharactersRepository _nonPlayerCharactersRepo;

        public NonPlayerCharactersController(NonPlayerCharactersRepository nonPlayerCharacterRepo)
        {
            _nonPlayerCharactersRepo = nonPlayerCharacterRepo;
        }

        //GET: api/NonPlayerCharacters/5
        [HttpGet("{id}")]
        public ActionResult<NonPlayerCharacter> GetNonPlayerCharacterById(int id)
        {
            //var nonPlayerCharacters = _nonPlayerCharactersRepo.GetNonPlayerCharactersByUserId(id);

            //if (nonPlayerCharacters == null)
            //{
            //    return NotFound();
            //}
            //return Ok(nonPlayerCharacters);
            throw new NotImplementedException();
        }

        [HttpGet("user/{userId}")]
        public ActionResult<NonPlayerCharacter> GetNpcsByUserId(int userId)
        {
            var nonPlayerCharacters = _nonPlayerCharactersRepo.GetNonPlayerCharactersByUserId(userId);

            if (nonPlayerCharacters == null)
            {
                return NotFound();
            }
            return Ok(nonPlayerCharacters);
        }

        [HttpPost]
        public ActionResult<NonPlayerCharacter> CreateNpc(NonPlayerCharacter newNpcObj)
        {
            var newNpc = _nonPlayerCharactersRepo.CreateNPC(newNpcObj);

            if (newNpc == null)
            {
                BadRequest();
            }
            return newNpc;
        }
    }
}