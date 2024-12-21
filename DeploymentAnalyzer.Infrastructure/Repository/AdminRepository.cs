using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
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
    public class AdminRepository : GenericRepository<AdminFunctionModel>, IAdminRepository
    {
        public IConfiguration _config { get; set; }
        public AdminRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<IReadOnlyList<AdminFunctionModel>> AdminGetFunctionsAsync(AdminRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.Admin_GetFunctions);
        }

        public async Task<IReadOnlyList<EventEmailConfigModel>> GetEventEmailConfigsAsync(BaseRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<EventEmailConfigModel>(StoreProcedures.GetAllEventEmailConfig, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<int> UpdateEventEmailConfig(EventEmailConfigModel request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", request.id);
            parameters.Add("@event_name", request.event_name);
            parameters.Add("@event_subscribers", request.event_subscribers);
            parameters.Add("@modified_date", request.modified_date);
            parameters.Add("@modified_by", request.modified_by);
            

            return await UpdateAsync(parameters, StoreProcedures.UpdateEventEmailConfig);
        }

        public async Task<EventEmailConfigModel?> GetEventEmailConfigByEventNameAsync(GetEventEmailConfigRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@event_name", request.event_name);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<EventEmailConfigModel>(StoreProcedures.GetEventEmailConfigByEventName, parameters, commandType: CommandType.StoredProcedure);

                return result.FirstOrDefault();
            }
        }
    }
}
