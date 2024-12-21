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
    public class KeyUpdateManagementRepository: GenericRepository<KeyUpdateManagementModel>, IKeyUpdateManagementRepository
    {
        public IConfiguration _config { get; set; }

        public KeyUpdateManagementRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<IReadOnlyList<KeyUpdateManagementModel>> GetKeyUpdatesAsync(int user_id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@company_id", null);
            parameters.Add("@country_id", null);
            parameters.Add("@therapeuticcategory_id", null);
            parameters.Add("@period_id", null);
            parameters.Add("@updateTag", null);
            parameters.Add("@security_token", null);

            return await GetAllAsync(parameters, StoreProcedures.GetKeyUpdatesList);
        }

        public async Task<IReadOnlyList<KeyUpdateManagementModel>> GetKeyUpdateListAsync(KeyUpdateRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@therapeuticcategory_id", request.therapeuticcategory_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@updateTag", request.updatetag);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.GetKeyUpdatesList);
        }

        public async Task<int> AddUpdateKeyAsync(UpdateManagementAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", request.Id);
            parameters.Add("@user_id", request.UserId);
            parameters.Add("@description", request.Description);
            parameters.Add("@countrycompany_id", request.CompanyCountry_Id);
            parameters.Add("@therapeuticcategory_id", request.TherapeuticCategory_Id);
            parameters.Add("@note", request.Note);
            parameters.Add("@period_Id",request.Period_Id);
            parameters.Add("@updateTag",request.UpdateTag);
            parameters.Add("@permission_granted", request.PermissionGranted);
            parameters.Add("@security_token", request.SecurityToken);
            return await AddAsync(parameters, StoreProcedures.AddUpdateKeyUpdate);
        }

        public async Task<int> DeleteKeyUpdateAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@KeyUpdate_Id", id);
            return await DeleteAsync(parameters, StoreProcedures.DeleteKeyUpdate);
        }

        public async Task<IReadOnlyList<KeyUpdateTagModel>> GetKeyUpdateTagsAsync(int user_id)
        {
            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();
                var parameters = new DynamicParameters();
                parameters.Add("@user_id", user_id);
                var result = await connection.QueryAsync<KeyUpdateTagModel>(StoreProcedures.GetKeyUpdateTags, null, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }
    }
}
