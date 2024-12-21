using Azure;
using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DeploymentAnalyzer.Utility.Common;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class UserEmailSuffixRepository : GenericRepository<UserEmailSuffixModel>, IUserEmailSuffixRepository
    {
        public IConfiguration _config { get; set; }
        public UserEmailSuffixRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<int> AddUserEmailSuffixAsync(UserEmailSuffixAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.UserId);
            parameters.Add("@EmailSuffix", request.EmailSuffix);

            return await AddAsync(parameters, StoreProcedures.AddUserEmailSuffix);
        }

        public async Task<int> AddUserRestrictedEmailSuffixAsync(UserRestrictedEmailSuffixAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.UserId);
            parameters.Add("@EmailSuffix", request.EmailSuffix);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var rowAffected = await connection.ExecuteAsync(StoreProcedures.AddUserRestrictedEmailSuffix, parameters, commandType: CommandType.StoredProcedure);

                return rowAffected;
            }
            
        }

        public async Task<int> DeleteUserEmailSuffixAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@EmailSuffixId", id);

            return await DeleteAsync(parameters, StoreProcedures.DeleteUserEmailSuffix);
        }

        public async Task<int> DeleteUserRestrictedEmailSuffixAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@EmailSuffixId", id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var rowAffected = await connection.ExecuteAsync(StoreProcedures.DeleteRestrictedUserEmailSuffix, parameters, commandType: CommandType.StoredProcedure);

                return rowAffected;
            }
        }

        public async Task<IReadOnlyList<UserEmailSuffixModel>> GetUserEmailSuffixAsync(int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", userId);

            return await GetAllAsync(parameters, StoreProcedures.GetUserEmailSuffix);
        }

        public async Task<IReadOnlyList<UserRestrictedEmailSuffixModel>> GetUserRestrictedEmailSuffixAsync(int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", userId);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var response = await connection.QueryAsync<UserRestrictedEmailSuffixModel>(StoreProcedures.GetUserRestrictedEmailSuffix, parameters, commandType: CommandType.StoredProcedure);

                return response.ToList();
            }
        }
    }
}
