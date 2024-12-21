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
    public class MyBrandRepository : GenericRepository<MyBrandModel>, IMyBrandRepository
    {
        public IConfiguration _config { get; set; }
        public MyBrandRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;

        }

        public async Task<IReadOnlyList<MyBrandModel>> GetMyBrandGroupsAsync(BaseRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.user_id);

            return await GetAllAsync(parameters, StoreProcedures.GetMyBrandsGroupNames);
        }

        public async Task<int> AddUpdateMyBrandAsync(AddUpdateMyBrandRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", request.id);
            parameters.Add("@user_id", request.userId);
            parameters.Add("@brands", request.brands);
            parameters.Add("@isChemicalGroup", request.isChemicalGroup);
            parameters.Add("@name", request.name);
            parameters.Add("@permission_granted", request.permission_granted);
            parameters.Add("@security_token", request.security_token);
            return await AddAsync(parameters, StoreProcedures.AddUpdateMyBrandGroup);
        }

        public async Task<int> DeleteMyBrandAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ID", id);
            return await DeleteAsync(parameters, StoreProcedures.DeleteMyBrandGroup);
        }

        public async Task<IReadOnlyList<IdNamePair>> GetBrandGroupFiltersAsync(BrandGroupFilterRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@type", request.type);
            parameters.Add("@companyId", request.companyId);
            parameters.Add("@therapeuticCategory_Id", request.therapeuticCategory_Id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<IdNamePair>(StoreProcedures.GetBrandGroupFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<CompanyTherapeuticBrandAssociationModel?> GetCompanyTherapeuticBrandAssociation(int myBrandId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@myBrandId", myBrandId);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryFirstOrDefaultAsync<CompanyTherapeuticBrandAssociationModel>(StoreProcedures.GetCompanyTherapeuticCategoryByMyBrandId, parameters, commandType: CommandType.StoredProcedure);

                return result;
            }
        }
    }
}
