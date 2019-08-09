using System;

namespace DMInsights.Models.GameSessions
{
    public class GameSession
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }

    }
}
