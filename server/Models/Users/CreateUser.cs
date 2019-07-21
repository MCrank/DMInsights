using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMInsights.Models.Users
{
    public class CreateUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string IdToken { get; set; }
    }
}
