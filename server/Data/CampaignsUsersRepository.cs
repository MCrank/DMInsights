using Dapper;
using DMInsights.Models.CampaignsUsers;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace DMInsights.Data
{
    public class CampaignsUsersRepository
    {
        readonly string _connectionString;

        public CampaignsUsersRepository(IOptions<DBConfiguration> dbConfig)
        {
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public CampaignsUsers CreateCampaignUser(int userId, int campaignId)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var createCampaignUsersQuery = @"
                    INSERT INTO [CampaignsUsers](
                        [UserId],
                        [CampaignId])
                    OUTPUT Inserted.*
                    VALUES(
                        @UserId,
                        @CampaignId)";

                var newCampaignUser = db.QueryFirstOrDefault<CampaignsUsers>(createCampaignUsersQuery, new
                {
                    userId,
                    campaignId,
                });

                if (newCampaignUser == null)
                {
                    return null;
                }
                return newCampaignUser;
            }
            throw new Exception("Could not create CampaignUser");
        }
    }
}
