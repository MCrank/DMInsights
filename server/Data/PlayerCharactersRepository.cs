using Dapper;
using DMInsights.Models.PlayerCharacters;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace DMInsights.Data
{
    public class PlayerCharactersRepository
    {
        readonly string _connectionString;

        public PlayerCharactersRepository(IOptions<DBConfiguration> dbConfig)
        {
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public List<PlayerCharacters> GetPlayerCharactersByUserId( int ownerId)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var getPCsQuery = @"
                        Select *
                        FROM [PlayerCharacters]
                        WHERE PlayerCharacters.OwnerId = @ownerId";

                var playerCharacters = db.Query<PlayerCharacters>(getPCsQuery, new { ownerId });

                if (playerCharacters != null)
                {
                    return playerCharacters.ToList();
                }
                else
                {
                    return null;
                }
            }
            throw new Exception("Error querying Player Characters");
        }
    }
}
