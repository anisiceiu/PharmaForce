using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class DataManagerProductRepository : GenericRepository<DataManagerProductModel>, IDataManagerProductRepository
    {
        public DataManagerProductRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<int> DeleteDMProductRecordAsync(string DADatabase_Product_Id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DADatabase_Product_Id", DADatabase_Product_Id);

            return await DeleteAsync(parameters, StoreProcedures.DeleteDMProductRecord);
        }

        public async Task<IReadOnlyList<DataManagerProductModel>> GetAllDataManagerProductsAsync(DataManagerProductsRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DADatabase_Salesforce_Id", request.DADatabase_Salesforce_Id);
            parameters.Add("@user_id", request.user_id);
            return await GetAllAsync(parameters, StoreProcedures.GetDataManagerProducts);
        }

    }
}
