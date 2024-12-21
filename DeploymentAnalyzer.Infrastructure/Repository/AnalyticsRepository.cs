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
    public class AnalyticsRepository : GenericRepository<AnalyticsModel>, IAnalyticsRepository
    {
        public IConfiguration _config { get; set; }
        public AnalyticsRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<IReadOnlyList<CompanyCountryAnalysisGridDataModel>> GetCompanyCountryAnalysisGridDataAsync(CompanyCountryAnalysisParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@countries", request.countries);
            parameters.Add("@periods", request.periods);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyCountryAnalysisGridDataModel>(StoreProcedures.GetAnalyticsCompanyCountryAnalysisGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<CompanyCountryAnalysisChartDataModel>> GetCompanyCountryAnalysisChartDataAsync(CompanyCountryAnalysisParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@countries", request.countries);
            parameters.Add("@periods", request.periods);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyCountryAnalysisChartDataModel>(StoreProcedures.GetAnalyticsCompanyCountryAnalysisChart, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

      
        public async Task<IReadOnlyList<CompanyDeploymentByCountryPCAndSpecialtyGridDataModel>> GetCompanyDeploymentByCountryPCAndSpecialtyGridDataAsync(CompanyDeploymentByCountryPCAndSpecialtyParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@countries", request.countries);
            parameters.Add("@companies", request.companies);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyDeploymentByCountryPCAndSpecialtyGridDataModel>(StoreProcedures.GetAnalyticsCompanyDeploymentByCountryGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<CompanyDeploymentByCountryPCAndSpecialtyChartDataModel>> GetCompanyDeploymentByCountryPCAndSpecialtyChartDataAsync(CompanyDeploymentByCountryPCAndSpecialtyParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@countries", request.countries);
            parameters.Add("@companies", request.companies);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyDeploymentByCountryPCAndSpecialtyChartDataModel>(StoreProcedures.GetAnalyticsCompanyDeploymentByCountryChart, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }


        public async Task<IReadOnlyList<TotalCompanyDeploymentByCountryAndTCGridDataModel>> GetTotalCompanyDeploymentByCountryAndTCGridDataAsync(TotalCompanyDeploymentByCountryAndTCParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@companies", request.companies);
            parameters.Add("@countries", request.countries);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);
            
            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<TotalCompanyDeploymentByCountryAndTCGridDataModel>(StoreProcedures.GetAnalyticsCompanyDeploymentByCountryAndTCGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<TotalCompanyDeploymentByCountryAndTCChartDataModel>> GetTotalCompanyDeploymentByCountryAndTCChartDataAsync(TotalCompanyDeploymentByCountryAndTCParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@companies", request.companies);
            parameters.Add("@countries", request.countries);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<TotalCompanyDeploymentByCountryAndTCChartDataModel>(StoreProcedures.GetAnalyticsCompanyDeploymentByCountryAndTCGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }


        public async Task<IReadOnlyList<CompanyPortfolioByTCAndSalesForceGridDataModel>> GetCompanyPortfolioByTCAndSalesForceGridDataAsync(CompanyPortfolioByTCAndSalesForceParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);
            

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyPortfolioByTCAndSalesForceGridDataModel>(StoreProcedures.GetAnalyticsCompanyPortfolioByTCAndSalesForceGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<CompanyPortfolioByTCAndSalesForceChartDataModel>> GetCompanyPortfolioByTCAndSalesForceChartDataAsync(CompanyPortfolioByTCAndSalesForceParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CompanyPortfolioByTCAndSalesForceChartDataModel>(StoreProcedures.GetAnalyticsCompanyPortfolioByTCAndSalesForceChart, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingBrandNameGridDataModel>> GetProductFTEsByTCAndSalesForceUsingBrandNameGridDataAsync(ProductFTEsByTCAndSalesForceUsingBrandNameParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@brands", request.brands);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@brandgroups", request.brandgroups);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);
            

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<ProductFTEsByTCAndSalesForceUsingBrandNameGridDataModel>(StoreProcedures.GetAnalyticsProductFTEsByTCAndSalesForceUsingBrandGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingBrandNameChartDataModel>> GetProductFTEsByTCAndSalesForceUsingBrandNameChartDataAsync(ProductFTEsByTCAndSalesForceUsingBrandNameParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@brands", request.brands);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@brandgroups",request.brandgroups);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<ProductFTEsByTCAndSalesForceUsingBrandNameChartDataModel>(StoreProcedures.GetAnalyticsProductFTEsByTCAndSalesForceUsingBrandChart, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }
        public async Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingGenericNameGridDataModel>> GetProductFTEsByTCAndSalesForceUsingGenericNameGridDataAsync(ProductFTEsByTCAndSalesForceUsingGenericNameParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@generic_names", request.generic_names);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);
            

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<ProductFTEsByTCAndSalesForceUsingGenericNameGridDataModel>(StoreProcedures.GetAnalyticsProductFTEsByTCAndSalesForceUsingGenericNameGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingGenericNameChartDataModel>> GetProductFTEsByTCAndSalesForceUsingGenericNameChartDataAsync(ProductFTEsByTCAndSalesForceUsingGenericNameParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@generic_names", request.generic_names);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);


            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<ProductFTEsByTCAndSalesForceUsingGenericNameChartDataModel>(StoreProcedures.GetAnalyticsProductFTEsByTCAndSalesForceUsingGenericNameChart, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }
        public async Task<IReadOnlyList<ReachAndFrequencyBySalesForceAndProductGridDataModel>> GetReachAndFrequencyBySalesForceAndProductGridDataAsync(ReachAndFrequencyBySalesForceAndProductParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@brands", request.brands);
            parameters.Add("@salesforces", request.salesforces);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<ReachAndFrequencyBySalesForceAndProductGridDataModel>(StoreProcedures.GetAnalyticsReachAndFrequencyBySalesForceAndProductGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<ReachAndFrequencyBySalesForceAndProductChartDataModel>> GetReachAndFrequencyBySalesForceAndProductChartDataAsync(ReachAndFrequencyBySalesForceAndProductParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@brands", request.brands);
            parameters.Add("@salesforces", request.salesforces);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<ReachAndFrequencyBySalesForceAndProductChartDataModel>(StoreProcedures.GetAnalyticsReachAndFrequencyBySalesForceAndProductChart, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }
        public async Task<IReadOnlyList<SalesRepresentativeCompensationBySalesForceAndProductGridDataModel>> GetSalesRepresentativeCompensationBySalesForceAndProductGridDataAsync(SalesRepresentativeCompensationBySalesForceAndProductParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@brands", request.brands);
            parameters.Add("@salesforces", request.salesforces);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<SalesRepresentativeCompensationBySalesForceAndProductGridDataModel>(StoreProcedures.GetAnalyticsSalesRepresentativeCompensationBySalesForceAndProductGrid, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<SalesRepresentativeCompensationBySalesForceAndProductChartDataModel>> GetSalesRepresentativeCompensationBySalesForceAndProductChartDataAsync(SalesRepresentativeCompensationBySalesForceAndProductParams request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@companies", request.companies);
            parameters.Add("@brands", request.brands);
            parameters.Add("@salesforces", request.salesforces);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@period_id", request.period_id);
            parameters.Add("@therapeutic_category_id", request.therapeutic_category_id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<SalesRepresentativeCompensationBySalesForceAndProductChartDataModel>(StoreProcedures.GetAnalyticsSalesRepresentativeCompensationBySalesForceAndProductChart, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<IReadOnlyList<CustomerDropdownModel>> GetCustomerDropdowns(CustomerDropdownListFilters request)
        {
            if (string.IsNullOrEmpty(request.columns))
            {
                request.columns = "Period_Year,Period_Quarter,Country_Name,Company_Name,SalesForce_Name,US_Product_Name_Product_Promoted,Generic_Name,Therapeutic_Category";
            }

            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@countries", request.countries);
            parameters.Add("@companies", request.companies);
            parameters.Add("@salesforces", request.salesforces);
            parameters.Add("@brands", request.brands);
            parameters.Add("@genericnames", request.genericnames);
            parameters.Add("@therapeuticcategories", request.therapeuticcategories);
            parameters.Add("@salesforces", request.salesforces);
            parameters.Add("@periods", request.periods);
            parameters.Add("@columns", request.columns);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CustomerDropdownModel>(StoreProcedures.GetCustomerDropdownList, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<int> WriteAnalyticsReportSearchLog(UserAnalyticSearchLogModel request)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@UserId", request.UserId);
            parameters.Add("@ReportId", request.ReportId);
            parameters.Add("@FilterSettings", request.FilterSettings);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var rowAffected = await connection.ExecuteAsync(StoreProcedures.AddUserAnalyticSearchLog, parameters, commandType: CommandType.StoredProcedure);

                return rowAffected;
            }
        }
    }
}
