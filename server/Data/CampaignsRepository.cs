using Dapper;
using DMInsights.Models.Campaigns;
using DMInsights.Models.Encounters;
using DMInsights.Models.GameSessions;
using DMInsights.Models.PlayerCharacters;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace DMInsights.Data
{
    public class CampaignsRepository
    {
        readonly string _connectionString;

        public CampaignsRepository(IOptions<DBConfiguration> dbConfig)
        {
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public Campaign GetCampaignByConnectionId(string connectionId)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var campaignByConnection = @"
                        SELECT *
                        FROM
                            [Campaigns] c
                        WHERE
                            c.ConnectionId = @connectionId";

                var myCampaign = db.QueryFirstOrDefault<Campaign>(campaignByConnection, new { connectionId });

                if (myCampaign == null)
                {
                    return null;
                }
                return myCampaign;
            }
        }

        public List<Campaign> GetMyCampaigns(int id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var myCampaignsSqlQuery = @"
                        SELECT
                            c.*
                        FROM
                            [Campaigns] c
                            JOIN
                                [Users] u
                            ON
                                u.Id = c.OwnerId
                        WHERE
                            u.id            = @id
                            AND c.IsDeleted = 0
                        
                        UNION
                        
                        SELECT
                            c.*
                        FROM
                            [Campaigns] c
                            JOIN
                                [PlayerCharacters] pc
                            ON
                                pc.CampaignId = c.Id
                            JOIN
                                [Users] u
                            ON
                                u.Id = pc.OwnerId
                        WHERE
                            u.id = @id
                            AND pc.IsDeleted = 0";

                //var myCampaignsSqlQuery = @"
                //        SELECT 
                //            c.Id, c.Title, c.[Description], c.ConnectionID, c.ImageUrl, c.OwnerId
                //        FROM 
                //            [Users] u
                //        JOIN
                //            [CampaignsUsers] cu ON cu.UserId = u.Id
                //        JOIN
                //            [Campaigns] c ON c.Id = cu.CampaignId
                //        WHERE 
                //            u.id = @id
                //        AND
                //            c.IsDeleted = 0";

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

        public List<PlayerCharacter> GetCampaignPcs(int id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var campaignPcsQuery = @"
                        SELECT pc.id, pc.Name, pc.[Level], pc.CharacterRace, pc.Classes, pc.HitPoints
                        FROM [PlayerCharacters] pc
                        JOIN [Campaigns] c ON c.id = pc.CampaignId
                        WHERE c.Id = @id";

                var campaignPcs = db.Query<PlayerCharacter>(campaignPcsQuery, new { id });

                if (campaignPcs == null)
                {
                    return null;
                }
                return campaignPcs.ToList();
            }
            throw new Exception("Could not get list of Players in teh campaign");
        }

        public List<GameSession> GetCampaignSessions(int id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var campaignsSessionsQuery = @"
                    SELECT gs.Title, gs.[Description], gs.DateCreated, gs.Id
                    FROM [GameSessions] gs
                    JOIN [Campaigns] c ON c.Id = gs.CampaignId
                    WHERE c.Id = @id";

                var campaignSessions = db.Query<GameSession>(campaignsSessionsQuery, new { id });

                if (campaignSessions == null)
                {
                    return null;
                }
                return campaignSessions.ToList();
            }
            throw new Exception("Could not get list of Players in teh campaign");
        }

        public List<Encounter> GetCampaignEncounters(int id)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var campaignEncounterQuery = @"
                        SELECT e.Id, e.DateCreated
                        FROM [Encounters] e
                        JOIN [GameSessions] gs ON gs.Id = e.GameSessionId
                        WHERE gs.id = @id";

                var campaignEncounters = db.Query<Encounter>(campaignEncounterQuery, new { id });

                if (campaignEncounters == null)
                {
                    return null;
                }
                return campaignEncounters.ToList();
            }
            throw new Exception("Could not get a list of encounters");
        }

    }
}
