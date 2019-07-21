using Dapper;
using DMInsights.Models.Users;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace DMInsights.Data
{
    public class UsersRepository
    {
        readonly string _connectionString;

        public UsersRepository(IOptions<DBConfiguration> dbConfig)
        {
            _connectionString = dbConfig.Value.ConnectionString;
        }

        public List<User> GetAllUsers()
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var getAllUsersQuery = @"SELECT * FROM [Users] ";

                var allUsers = db.Query<User>(getAllUsersQuery).ToList();

                if (allUsers != null)
                {
                    return allUsers;
                }
            }
            throw new Exception("No Users found");
        }

        public User GetUserByIdToken(string idToken)
        {
            using(var db = new SqlConnection(_connectionString))
            {
                var getSingleUserQuery = @"
                        SELECT *
                        FROM [Users]
                        WHERE Users.IdToken = @idToken";

                var singleUser = db.QueryFirstOrDefault<User>(getSingleUserQuery, new { idToken });

                if (singleUser != null)
                {
                    return singleUser;
                }
                else
                {
                    return null;
                }
            }
            throw new Exception("Error querying for user");
        }

        public User CreateNewUser(CreateUser newUserObj)
        {
            using (var db = new SqlConnection(_connectionString))
            {

                var newUserQuery = @"
                        INSERT INTO [Users] ([FirstName], [LastName], [UserName], [IdToken])
                        OUTPUT inserted.*
                        VALUES(@FirstName, @LastName, @UserName, @IdToken)";

                var newUser = db.QueryFirstOrDefault<User>(newUserQuery, new
                {
                    newUserObj.FirstName,
                    newUserObj.LastName,
                    newUserObj.UserName,
                    newUserObj.IdToken
                });
                
                if (newUser != null)
                {
                    return newUser;
                };
            }
            throw new Exception("Error creating User");
        }
    }
}
