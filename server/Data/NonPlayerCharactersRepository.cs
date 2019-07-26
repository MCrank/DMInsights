﻿using Dapper;
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
    }
}
