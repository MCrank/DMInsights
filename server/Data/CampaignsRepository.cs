using Dapper;
using DMInsights.Models.Campaigns;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace DMInsights.Data
{
    public class CampaignsRepository
    {
        readonly string _connectionString;

        public CampaignsRepository(IOptions<DBConfiguration> dbConfig)
        {
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public List<Campaign> GetMyCampaigns(int id)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var myCampaignsSqlQuery = @"
                        SELECT 
                            c.Id, c.Title, c.[Description], c.ConnectionID, c.ImageUrl, c.OwnerId
                        FROM 
                            [Users] u
                        JOIN
                            [CampaignsUsers] cu ON cu.UserId = u.Id
                        JOIN
                            [Campaigns] c ON c.Id = cu.CampaignId
                        WHERE 
                            u.id = @id";

                var myCampaigns = db.Query<Campaign>(myCampaignsSqlQuery, new { id });

                if (myCampaigns == null)
                {
                    return null;
                }
                return myCampaigns.ToList();
            }
        }

    }
}
