using System;

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
        public bool IsDeleted { get; set; }
    }
}
