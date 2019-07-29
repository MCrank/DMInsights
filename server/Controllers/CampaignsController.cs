using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMInsights.Data;
using DMInsights.Models.Campaigns;
using DMInsights.Models.Encounters;
using DMInsights.Models.GameSessions;
using DMInsights.Models.PlayerCharacters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DMInsights.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampaignsController : SecureControllerBase
    {
        readonly CampaignsRepository _campaignsRepo;
        readonly CampaignsUsersRepository _campaignsUserRepo;

        public CampaignsController(CampaignsRepository campaignsRepo, CampaignsUsersRepository campaignsUsersRepo)
        {
            _campaignsRepo = campaignsRepo;
            _campaignsUserRepo = campaignsUsersRepo;
        }

        [HttpGet("{id}/players")]
        public ActionResult<PlayerCharacter> GetCampaignPcs(int id)
        {
            var campaignPlayers = _campaignsRepo.GetCampaignPcs(id);

            if (campaignPlayers == null )
            {
                return NotFound();
            }
            return Ok(campaignPlayers);
        }

        [HttpGet("{id}/sessions")]
        public ActionResult<GameSession> GetCampaignSessions(int id)
        {
            var campaignSessions = _campaignsRepo.GetCampaignSessions(id);

            if (campaignSessions == null)
            {
                return NotFound();
            }
            return Ok(campaignSessions);
        }

        [HttpGet("{id}/encounters")]
        public ActionResult<Encounter> GetCampaignEncounters(int id)
        {
            var campaignSessionEncounters = _campaignsRepo.GetCampaignEncounters(id);

            if (campaignSessionEncounters == null)
            {
                return NotFound();
            }
            return Ok(campaignSessionEncounters);
        }
        


        //GET: api/campaigns
        [HttpPost]
        public ActionResult<Campaign> CreateCampaign(Campaign campaignObj)
        {
            var newCampaign = _campaignsRepo.CreateCampaign(campaignObj);

            if (newCampaign == null)
            {
                return BadRequest();
            }

            var newCampaignId = newCampaign.Id;
            var userId = newCampaign.OwnerId;
            var newCampaignUser = _campaignsUserRepo.CreateCampaignUser(userId, newCampaignId);
            if (newCampaignUser == null)
            {
                return StatusCode(500);
            }
            return newCampaign;
        }

        [HttpPut]
        public ActionResult<Campaign> UpdateCampaign([FromBody] Campaign updatedCampaignObj)
        {
            var updatedCampaign = _campaignsRepo.UpdateCampaign(updatedCampaignObj);

            if (updatedCampaign == null)
            {
                return BadRequest();
            }
            return Ok(updatedCampaign);
        }

        [HttpDelete("{id}")]
            public ActionResult DeleteCampaign(int id)
        {
            var deletedCampaign = _campaignsRepo.DeleteCampaign(id);

            if (!deletedCampaign)
            {
                return StatusCode(500, "Error deleting campaign");
            }
            return NoContent();
        }
    }
}