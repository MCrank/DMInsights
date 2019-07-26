using Dapper;
using DMInsights.Models.NonPlayerCharacters;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace DMInsights.Data
{
    public class NonPlayerCharactersRepository
    {
        readonly string _connectionString;

        public NonPlayerCharactersRepository(IOptions<DBConfiguration> dbConfig)
        {
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public List<NonPlayerCharacter> GetNonPlayerCharactersByUserId(int ownerId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var getNpcSqlQuery = @"
                        SELECT *
                        FROM [NonPlayerCharacters]
                        WHERE NonPlayerCharacters.OwnerId = @ownerId";

                var nonPlayerCharacters = db.Query<NonPlayerCharacter>(getNpcSqlQuery, new { ownerId });

                if (nonPlayerCharacters != null)
                {
                    return nonPlayerCharacters.ToList();
                }
                else
                {
                    return null;
                }
            }
            throw new Exception("Error querying Non Player Characters");
        }
    }
}
