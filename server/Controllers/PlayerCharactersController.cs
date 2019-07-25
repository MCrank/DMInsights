using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMInsights.Data;
using DMInsights.Models.PlayerCharacters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DMInsights.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class PlayerCharactersController : SecureControllerBase
    {
        readonly PlayerCharactersRepository _playerCharactersRepo;

        public PlayerCharactersController(PlayerCharactersRepository playerCharactersRepo)
        {
            _playerCharactersRepo = playerCharactersRepo;
        }

        // GET: api/PlayerCharacters/5
        [HttpGet("{id}")]
        public ActionResult<PlayerCharacter> GetPlayerCharactersByUserId(int id)
        {
            var playerCharacters = _playerCharactersRepo.GetPlayerCharactersByUserId(id);

            if (playerCharacters == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(playerCharacters);
            }
        }

        [HttpPost]
        public ActionResult<PlayerCharacter> CreatePlayerCharacter([FromBody] PlayerCharacter newPlayerCharacterObj)
        {
            var newPlayerCharacter = _playerCharactersRepo.CreateNewPlayerCharacter(newPlayerCharacterObj);
            if (newPlayerCharacter == null)
            {
                return BadRequest();
            }
            else
            {
                return Ok(newPlayerCharacter);
            }
        }

        [HttpPut]
        public ActionResult<PlayerCharacter> UpdatePlayerCharacter([FromBody] PlayerCharacter updatedPlayerCharacterObj)
        {
            var updatePlayerCharacter = _playerCharactersRepo.UpdatePlayerCharacter(updatedPlayerCharacterObj);

            if (updatePlayerCharacter == null)
            {
                return BadRequest();
            }
            else
            {
                return Ok(updatePlayerCharacter);
            }
        }
    }
}