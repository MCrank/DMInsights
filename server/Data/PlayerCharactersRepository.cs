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

        public List<PlayerCharacter> GetPlayerCharactersByUserId( int ownerId)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var getPCsQuery = @"
                        Select *
                        FROM [PlayerCharacters]
                        WHERE PlayerCharacters.OwnerId = @ownerId";

                var playerCharacters = db.Query<PlayerCharacter>(getPCsQuery, new { ownerId });

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

        public PlayerCharacter CreateNewPlayerCharacter(PlayerCharacter newPlayerCharacterObj)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var newPlayerCharacterQuery = @"
                        INSERT INTO [PlayerCharacters] (
                          [Name], [HitPoints], [ArmorClass], [CampaignId], 
                          [Description], [ImageUrl], [MoveSpeed], 
                          [OwnerId], [CharacterRace], [CharacterType], 
                          [PassivePerception], [InitiativeModifier], 
                          [SpellSaveDC], [Classes], [Level]
                        ) 
                        OUTPUT Inserted.*
                        VALUES 
                          (
                            @Name, @HitPoints, @ArmorClass, @CampaignId, 
                            @Description, @ImageUrl, @MoveSpeed, 
                            @OwnerId, @CharacterRace, @CharacterType, 
                            @PassivePerception, @InitiativeModifier, 
                            @SpellSaveDC, @Classes, @Level
                          )";

                var newPlayerCharacter = db.QueryFirstOrDefault<PlayerCharacter>(newPlayerCharacterQuery, new
                {
                    newPlayerCharacterObj.Name,
                    newPlayerCharacterObj.HitPoints,
                    newPlayerCharacterObj.ArmorClass,
                    newPlayerCharacterObj.CampaignId,
                    newPlayerCharacterObj.Description,
                    newPlayerCharacterObj.ImageUrl,
                    newPlayerCharacterObj.MoveSpeed,
                    newPlayerCharacterObj.OwnerId,
                    newPlayerCharacterObj.CharacterRace,
                    newPlayerCharacterObj.CharacterType,
                    newPlayerCharacterObj.PassivePerception,
                    newPlayerCharacterObj.InitiativeModifier,
                    newPlayerCharacterObj.SpellSaveDC,
                    newPlayerCharacterObj.Classes,
                    newPlayerCharacterObj.Level
                });

                if (newPlayerCharacter != null)
                {
                    return newPlayerCharacter;
                }
                else
                {
                    return null;
                }
            }
            throw new Exception("Error creating new character");
        }

        public PlayerCharacter UpdatePlayerCharacter(PlayerCharacter playerCharacterObj)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var updatePlayerCharacterQuery = @"
                        UPDATE 
	                        [PlayerCharacters]
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
                            [Classes] = @classes,
                            [Level] = @level,
                            [CampaignId] = @campaignId
                        WHERE Id = @id";

                var rowsAffected = db.Execute(updatePlayerCharacterQuery, playerCharacterObj);

                if (rowsAffected == 1)
                {
                    return playerCharacterObj;
                }
                else
                {
                    return null;
                }
            }
            throw new Exception("Could not update player character");
        }
    }
}
