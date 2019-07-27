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
                        WHERE NonPlayerCharacters.OwnerId = @ownerId
                        AND NonPlayerCharacters.IsDeleted = 0";

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

        public NonPlayerCharacter CreateNPC(NonPlayerCharacter npcObject)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var createNpcQuery = @"
                    INSERT INTO [NonPlayerCharacters](
                        [Name], 
                        [HitPoints], 
                        [ArmorClass], 
                        [Description], 
                        [ImageUrl], 
                        [MoveSpeed], 
                        [OwnerId], 
                        [CharacterRace], 
                        [CharacterType], 
                        [PassivePerception], 
                        [InitiativeModifier], 
                        [SpellSaveDC], 
                        [ChallengeRating])
                    OUTPUT inserted.*
                    VALUES(
                        @Name, 
                        @HitPoints, 
                        @ArmorClass, 
                        @Description, 
                        @ImageUrl, 
                        @MoveSpeed, 
                        @OwnerId, 
                        @CharacterRace, 
                        @CharacterType, 
                        @PassivePerception, 
                        @InitiativeModifier, 
                        @SpellSaveDC, 
                        @ChallengeRating)";

                var newNpc = db.QueryFirstOrDefault<NonPlayerCharacter>(createNpcQuery, new
                {
                    npcObject.Name,
                    npcObject.HitPoints,
                    npcObject.ArmorClass,
                    npcObject.Description,
                    npcObject.ImageUrl,
                    npcObject.MoveSpeed,
                    npcObject.OwnerId,
                    npcObject.CharacterRace,
                    npcObject.CharacterType,
                    npcObject.PassivePerception,
                    npcObject.InitiativeModifier,
                    npcObject.SpellSaveDC,
                    npcObject.ChallengeRating
                });

                if (newNpc == null)
                {
                    return null;
                }
                return newNpc;
            }
        }

        public NonPlayerCharacter UpdateNonPlayerCharacter(NonPlayerCharacter npcObj)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var updateNpcCharacterQuery = @"
                        UPDATE 
	                        [NonPlayerCharacters]
                        SET
	                        [Name] = @name,
                            [HitPoints] = @hitPoints,
                            [ArmorClass] = @armorClass,
                            [Description] = @description,
                            [ImageUrl] = @imageUrl,
                            [MoveSpeed] = @moveSpeed,
                            [OwnerId] = @ownerId,
                            [CharacterRace] = @characterRace,
                            [CharacterType] = @characterType,
                            [PassivePerception] = @passivePerception,
                            [InitiativeModifier] = @initiativeModifier,
                            [SpellSaveDC] = @spellSaveDc,
                            [ChallengeRating] = @challengeRating,
                            [CampaignId] = @campaignId
                        WHERE Id = @id";

                var rowsAffected = db.Execute(updateNpcCharacterQuery, npcObj);

                if (rowsAffected != 1)
                {
                    return null;
                }
                return npcObj;
            }
            throw new Exception("Could not update the NPC");
        }

        public bool DeleteNpc(int id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var deleteNpcQuery = @"
                        UPDATE
                            [NonPlayerCharacters]
                        SET
                            [IsDeleted] = 1
                        WHERE 
                            id = @id";

                var rowsAffected = db.Execute(deleteNpcQuery, new { id });

                if (rowsAffected != 1)
                {
                    return false;
                }
                return true;
            }
            throw new Exception("Could not delete the Non Player Character");
        }
    }
}
