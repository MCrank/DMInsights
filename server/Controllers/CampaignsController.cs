using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMInsights.Data;
using DMInsights.Models.Campaigns;
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
    }
}