using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
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
using System.Web;
using DeploymentAnalyzer.Utility.Common;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class UserPreferenceRepository : GenericRepository<UserPreferenceModel>, IUserPreferenceRepository
    {
        public IConfiguration _config { get; set; }
        public UserPreferenceRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<int> AddOrUpdateUserAnalyticFiltersAsync(UserAnalyticFilterModel request)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@Id", request.Id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@SearchFilterName", request.SearchFilterName);
            parameters.Add("@UserId", request.UserId);
            parameters.Add("@PageName", request.PageName);
            parameters.Add("@ReportId", request.ReportId);
            parameters.Add("@FilterSettings", request.FilterSettings);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var rowAffected = await connection.ExecuteAsync(StoreProcedures.AddUpdateUserAnalyticFilters, parameters, commandType: CommandType.StoredProcedure);

                return rowAffected;
            }
         }

       public async Task<int> AddOrUpdateUserPreferencesAsync(UserPreferenceModel request)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@UserId", request.UserId);
            parameters.Add("@PageId", request.PageId);
            parameters.Add("@GridId", request.GridId);
            parameters.Add("@FilterSettings", request.FilterSettings);
            parameters.Add("@ColumnSettings", request.ColumnSettings);

            return await AddAsync(parameters, StoreProcedures.AddUpdateUserPreference);
        }

        public async Task<IReadOnlyList<UserAnalyticFilterModel>> GetUserAnalyticFiltersAsync(int userId,int client_id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", userId);
            parameters.Add("@client_id", client_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<UserAnalyticFilterModel>(StoreProcedures.GetUserAnalyticFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<UserPreferenceModel>> GetUserPreferencesAsync(int userId, int pageId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", userId);
            parameters.Add("@PageId", pageId);

            return await GetAllAsync(parameters, StoreProcedures.GetUserPreference);
        }

        public async Task<int> DeleteUserAnalyticFiltersAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            return await DeleteAsync(parameters, StoreProcedures.DeleteUserAnalyticsSavedFilter);
        }
    }
}
