using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
