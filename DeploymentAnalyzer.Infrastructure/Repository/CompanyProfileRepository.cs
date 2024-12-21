using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Common;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;


namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class CompanyProfileRepository : GenericRepository<CompanyProfileModel>, ICompanyProfileRepository
    {
        public IConfiguration _config { get; set; }
        public CompanyProfileRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<int> AddRemoveFavoriteCompanyAsync(AddRemoveFavoriteCompanyRequest request)
        {

            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@company_id", request.Company_Id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@result", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var output = await AddAsync(parameters, StoreProcedures.AddRemoveFavoriteCompany);
            int result = parameters.Get<int>("@result");
            return result;
        }

        public async Task<IReadOnlyList<CompanyProfileModel>> GetCompanyForProfileListAsync(CompanyProfileRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);
            parameters.Add("@country", request.country);
            parameters.Add("@region", request.region);

            return await GetAllAsync(parameters, StoreProcedures.GetCompaniesForUserProfile);
        }

        public async Task<IReadOnlyList<CompanyProfileModel>> GetFavoriteCompanyListAsync(FavoriteCompanyListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);

            return await GetAllAsync(parameters, StoreProcedures.GetFavoriteCompanyProfile);
        }

        public async Task<IReadOnlyList<CompanyProfileDataModel>> GetCompanyProfileRecordsAsync(CompanyProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@country", request.country);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);
            parameters.Add("@security_token", request.security_token);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyProfileDataModel>(StoreProcedures.GetCompanyProfileRecords, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }

        }

        public async Task<CompanyProfileTopInfoModel> GetCompanyProfileTopInfoAsync(CompanyProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@country", request.country);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);
            parameters.Add("@security_token", request.security_token);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryFirstOrDefaultAsync<CompanyProfileTopInfoModel>(StoreProcedures.GetCompanyProfileTopInfo, parameters, commandType: CommandType.StoredProcedure);

                return result;
            }

        }

        public async Task<IReadOnlyList<TherapeuticCategoryWiseCompanyInfoModel>> GetTherapeuticCategoryWiseCompanyInfoAsync(CompanyProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@country", request.country);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);
            parameters.Add("@security_token", request.security_token);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<TherapeuticCategoryWiseCompanyInfoModel>(StoreProcedures.GetTherapeuticCategoryWiseCompanyInfo, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<AdditionalNote>> GetAdditionalNoteListAsync(CompanyProfileListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@country", request.country);
            parameters.Add("@period_year", request.period_year);
            parameters.Add("@period_quarter", request.period_quarter);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<AdditionalNote>(StoreProcedures.GetCompanyProfileAdditionalNotes, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<CompanyProductProfileUserFilterModel>> GetCompanyProductProfileUserPreferences(CompanyProductProfileUserPreferenceRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@item_type", request.item_type);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@product_id", request.product_id);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyProductProfileUserFilterModel>(StoreProcedures.GetCompanyProductProfileUserFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<int> AddUpdateCompanyProductProfileUserPreference(AddUpdateCompanyProductProfileUserPreferenceRequest request)
        {
           
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@item_type", request.item_type);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@product_id", request.product_id);
            parameters.Add("@country_name", request.country_name);
            parameters.Add("@company_name", request.company_name);
            parameters.Add("@period_id", request.period_id);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.ExecuteAsync(StoreProcedures.AddUpdateCompanyProductProfileUserFilters, parameters, commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public async Task<IReadOnlyList<CompanyUpdateInfoModel>> GetCompanyUpdateInfoAsync(BaseRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyUpdateInfoModel>(StoreProcedures.GetCompanyUpdate, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<int> SubscribeUnSubscribeFavoriteCompanyAsync(SubscribeUnSubscribeFavoriteCompanyRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@company_id", request.Company_Id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@alerts_enabled", request.alerts_enabled,DbType.Boolean);
            parameters.Add("@security_token", request.security_token);

            return await AddAsync(parameters, StoreProcedures.SubscribeUnSubscribeFavoriteCompany);     
        }
    }
}
