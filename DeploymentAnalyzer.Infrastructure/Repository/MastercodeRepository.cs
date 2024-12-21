using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Common;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics.Metrics;
using System.Xml.Linq;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class MastercodeRepository : GenericRepository<MasterCodeModel>, IMasterCodeRepository
    {
        public IConfiguration _config { get; set; }
        public MastercodeRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }
        public async Task<MasterCodeAddUpdateResult> AddUpdateMastercodeAsync(MasterCodeRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@id", request.Id);
            parameters.Add("@category", request.category);
            parameters.Add("@name", request.name);
            parameters.Add("@region",request.region);
            parameters.Add("@currency_symbol", request.currency_symbol);
            parameters.Add("@website", request.website);
            parameters.Add("@headquarters", request.headquarters);
            parameters.Add("@number_of_employees", request.number_of_employees);
            parameters.Add("@type_of_entity", request.type_of_entity);
            parameters.Add("@sales_previous_year", request.sales_previous_year);
            parameters.Add("@salesforce_name", request.salesforce_name);
            parameters.Add("@country", request.country);
            parameters.Add("@company", request.company);
            parameters.Add("@generic_name", request.generic_name);
            parameters.Add("@us_name", request.us_name);
            parameters.Add("@product_name", request.product_name);
            parameters.Add("@year", request.year);
            parameters.Add("@quarter", request.quarter);
            parameters.Add("@type_of_salesforce", request.type_of_salesforce);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@message",string.Empty,DbType.String,ParameterDirection.Output);
            
            var row_affected = await AddAsync(parameters, StoreProcedures.AddUpdateMastercode);
            var message = parameters.Get<string>("@message");

            return new MasterCodeAddUpdateResult {
                row_affected=row_affected,
                message=message
            };
        }

        public async Task<int> DeleteMasterCodeAsync(long id, int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", id);
            parameters.Add("@user_id", userId);
            parameters.Add("@delete_option", 1);
            parameters.Add("@security_token ", "");
            return await DeleteAsync(parameters, StoreProcedures.DeleteMastercode);
        }

        public async Task<IReadOnlyList<string>> GetMasterCodeAllCategories()
        {
            var response = new List<string>();
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", 0);
            parameters.Add("@security_token", "");

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var multiQuery = await connection.QueryMultipleAsync(StoreProcedures.GetMasterCodeCategories, parameters, commandType: CommandType.StoredProcedure);

                response = (await multiQuery.ReadAsync<string>()).ToList();
               
            }
            return response;
        }

        public async Task<IReadOnlyList<MasterCodeModel>> GetMasterCodeAsync()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", 0);
            return await GetAllAsync(parameters, StoreProcedures.GetMasterCodes);
        }

        public async Task<IReadOnlyList<MasterCodeModel>> GetMasterCodeByCategory(MasterCodeModel request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@category", request.category);
            return await GetAllAsync(parameters, StoreProcedures.GetMasterCodes);
        }

        public async Task<MasterCodeModel> GetAdminCurrentPeriodAsync(int user_id = 0, string security_token = "")
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@security_token", security_token);
            return await GetByIdAsync(parameters, StoreProcedures.GetAdminCurrentPeriod);
        }

        public async Task<IReadOnlyList<USNameOptions>> GetMasterCodeUSNameFilters(MasterCodeFilterRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@type", 5);
            parameters.Add("@region", request.region);
            parameters.Add("@country", request.country);
            parameters.Add("@company", request.company);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<USNameOptions>(StoreProcedures.GetMasterCodeFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }
        public async Task<IReadOnlyList<IdNamePair>> GetMasterCodeAddFilters(int type)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@type",type);
            

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<IdNamePair>(StoreProcedures.GetMasterCodeAddFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<IdNamePair>> GetMasterCodeFiltersAsync(MasterCodeFilterRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@type", request.type);
            parameters.Add("@region", request.region);
            parameters.Add("@country", request.country);
            parameters.Add("@company", request.company);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<IdNamePair>(StoreProcedures.GetMasterCodeFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<MasterCodeModel>> GetMasterCodeRecordsAsync(MasterCodeListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@category", request.category);

            return await GetAllAsync(parameters, StoreProcedures.GetMasterCodeRecords);
        }
    }
}
