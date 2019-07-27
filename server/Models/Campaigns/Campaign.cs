using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMInsights.Models.Campaigns
{
    public class Campaign
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public Guid ConnectionId { get; set; }
        public int OwnerId { get; set; }
    }
}
