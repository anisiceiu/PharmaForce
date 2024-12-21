using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Common;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class ProductProfileRepository : GenericRepository<ProductProfileModel>, IProductProfileRepository
    {
        public IConfiguration _config { get; set; }

        public ProductProfileRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<int> AddRemoveFavoriteProductAsync(AddRemoveFavoriteProductRequest request)
        {

            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@Product_id", request.Product_Id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@result", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var output = await AddAsync(parameters, StoreProcedures.AddRemoveFavoriteProduct);
            int result = parameters.Get<int>("@result");
            return result;
        }

        public async Task<IReadOnlyList<ProductProfileDataModel>> GetProductProfileRecordsAsync(ProductProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@product_id", request.product_id);
            parameters.Add("@company", request.company);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);
            parameters.Add("@security_token", request.security_token);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<ProductProfileDataModel>(StoreProcedures.GetProductProfileRecords, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }

        }

        public async Task<ProductProfileTopInfoModel> GetProductProfileTopInfoAsync(ProductProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@product_id", request.product_id);
            parameters.Add("@company", request.company);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);
            parameters.Add("@security_token", request.security_token);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryFirstOrDefaultAsync<ProductProfileTopInfoModel>(StoreProcedures.GetProductProfileInfo, parameters, commandType: CommandType.StoredProcedure);

                return result;
            }

        }


        public async Task<IReadOnlyList<ProductProfileModel>> GetProductForProfileListAsync(ProductProfileRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@country", request.country);
            parameters.Add("@region", request.region);
            parameters.Add("@company", request.company);

            return await GetAllAsync(parameters, StoreProcedures.GetProductsForUserProfile);
        }

        public async Task<IReadOnlyList<ProductProfileModel>> GetFavoriteProductListAsync(FavoriteProductListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);

            return await GetAllAsync(parameters, StoreProcedures.GetFavoriteProductProfile);
        }

        public async Task<IReadOnlyList<TherapeuticCategoryWiseProductInfoModel>> GetTherapeuticCategoryWiseProductInfoAsync(ProductProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@product_id", request.product_id);
            parameters.Add("@company", request.company);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);
            parameters.Add("@security_token", request.security_token);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<TherapeuticCategoryWiseProductInfoModel>(StoreProcedures.GetTherapeuticCategoryWiseProductInfo, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<AdditionalNote>> GetAdditionalNoteListAsync(ProductProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@product_id", request.product_id);
            parameters.Add("@company", request.company);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);
            parameters.Add("@user_id", request.user_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<AdditionalNote>(StoreProcedures.GetProductProfileAdditionalNotes, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<int> SubscribeUnSubscribeFavoriteProductAsync(SubscribeUnSubscribeFavoriteProductRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@product_id", request.Product_Id);
            parameters.Add("@alerts_enabled", request.alerts_enabled, DbType.Boolean);
            parameters.Add("@security_token", request.security_token);

            return await AddAsync(parameters, StoreProcedures.SubscribeUnSubscribeFavoriteProduct);
        }
    }
}
