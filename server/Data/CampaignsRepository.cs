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
            using (var db = new SqlConnection(_connectionString))
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
                            u.id = @id
                        AND
                            c.IsDeleted = 0";

                var myCampaigns = db.Query<Campaign>(myCampaignsSqlQuery, new { id });

                if (myCampaigns == null)
                {
                    return null;
                }
                return myCampaigns.ToList();
            }
        }

        public Campaign CreateCampaign(Campaign campaignObj)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var createCampaignQuery = @"
                    INSERT INTO [Campaigns](
                        [Title],
                        [Description],
                        [ImageUrl],
                        [ConnectionID],
                        [OwnerId],
                        [IsDeleted])
                    OUTPUT Inserted.*
                    VALUES(
                        @Title,
                        @Description,
                        @ImageUrl,
                        NEWID(),
                        @OwnerId,
                        @IsDeleted)";

                var newCampaign = db.QueryFirstOrDefault<Campaign>(createCampaignQuery, new
                {
                    campaignObj.Title,
                    campaignObj.Description,
                    campaignObj.ImageUrl,
                    campaignObj.OwnerId,
                    campaignObj.IsDeleted
                });

                if (newCampaign == null)
                {
                    return null;
                }
                return newCampaign;
            }
            throw new Exception("Could not create new campaign");
        }

        public Campaign UpdateCampaign(Campaign campaignObj)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var updateCampaignQuery = @"
                        UPDATE
                            [Campaigns]
                        SET
                            [Title] = @Title,
                            [Description] = @Description,
                            [ImageUrl] = @ImageUrl
                        WHERE
                            Id = @id";

                var rowsAffected = db.Execute(updateCampaignQuery, campaignObj);

                if (rowsAffected != 1)
                {
                    return null; ;
                }
                return campaignObj;
            }
            throw new Exception("Could not update the campaign");
        }

        public bool DeleteCampaign(int id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var deleteCampignQuery = @"
                        UPDATE
                            [Campaigns]
                        SET
                            [IsDeleted] = 1
                        WHERE
                            id = @id";

                var rowsAffected = db.Execute(deleteCampignQuery, new { id });

                if (rowsAffected != 1)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            throw new Exception("Could not delete your campaign");
        }

    }
}
