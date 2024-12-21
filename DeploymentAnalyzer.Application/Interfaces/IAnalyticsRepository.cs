using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IAnalyticsRepository : IGenericRepository<AnalyticsModel>
    {
        Task<IReadOnlyList<CompanyCountryAnalysisGridDataModel>> GetCompanyCountryAnalysisGridDataAsync(CompanyCountryAnalysisParams request);
        Task<IReadOnlyList<CompanyCountryAnalysisChartDataModel>> GetCompanyCountryAnalysisChartDataAsync(CompanyCountryAnalysisParams request);
        Task<IReadOnlyList<CompanyDeploymentByCountryPCAndSpecialtyGridDataModel>> GetCompanyDeploymentByCountryPCAndSpecialtyGridDataAsync(CompanyDeploymentByCountryPCAndSpecialtyParams request);
        Task<IReadOnlyList<CompanyDeploymentByCountryPCAndSpecialtyChartDataModel>> GetCompanyDeploymentByCountryPCAndSpecialtyChartDataAsync(CompanyDeploymentByCountryPCAndSpecialtyParams request);
        Task<IReadOnlyList<TotalCompanyDeploymentByCountryAndTCGridDataModel>> GetTotalCompanyDeploymentByCountryAndTCGridDataAsync(TotalCompanyDeploymentByCountryAndTCParams request);
        Task<IReadOnlyList<TotalCompanyDeploymentByCountryAndTCChartDataModel>> GetTotalCompanyDeploymentByCountryAndTCChartDataAsync(TotalCompanyDeploymentByCountryAndTCParams request);
        Task<IReadOnlyList<CompanyPortfolioByTCAndSalesForceGridDataModel>> GetCompanyPortfolioByTCAndSalesForceGridDataAsync(CompanyPortfolioByTCAndSalesForceParams request);
        Task<IReadOnlyList<CompanyPortfolioByTCAndSalesForceChartDataModel>> GetCompanyPortfolioByTCAndSalesForceChartDataAsync(CompanyPortfolioByTCAndSalesForceParams request);
        Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingBrandNameGridDataModel>> GetProductFTEsByTCAndSalesForceUsingBrandNameGridDataAsync(ProductFTEsByTCAndSalesForceUsingBrandNameParams request);
        Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingBrandNameChartDataModel>> GetProductFTEsByTCAndSalesForceUsingBrandNameChartDataAsync(ProductFTEsByTCAndSalesForceUsingBrandNameParams request);
        Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingGenericNameGridDataModel>> GetProductFTEsByTCAndSalesForceUsingGenericNameGridDataAsync(ProductFTEsByTCAndSalesForceUsingGenericNameParams request);
        Task<IReadOnlyList<ProductFTEsByTCAndSalesForceUsingGenericNameChartDataModel>> GetProductFTEsByTCAndSalesForceUsingGenericNameChartDataAsync(ProductFTEsByTCAndSalesForceUsingGenericNameParams request);
        Task<IReadOnlyList<SalesRepresentativeCompensationBySalesForceAndProductGridDataModel>> GetSalesRepresentativeCompensationBySalesForceAndProductGridDataAsync(SalesRepresentativeCompensationBySalesForceAndProductParams request);
        Task<IReadOnlyList<SalesRepresentativeCompensationBySalesForceAndProductChartDataModel>> GetSalesRepresentativeCompensationBySalesForceAndProductChartDataAsync(SalesRepresentativeCompensationBySalesForceAndProductParams request);
        Task<IReadOnlyList<ReachAndFrequencyBySalesForceAndProductGridDataModel>> GetReachAndFrequencyBySalesForceAndProductGridDataAsync(ReachAndFrequencyBySalesForceAndProductParams request);
        Task<IReadOnlyList<ReachAndFrequencyBySalesForceAndProductChartDataModel>> GetReachAndFrequencyBySalesForceAndProductChartDataAsync(ReachAndFrequencyBySalesForceAndProductParams request);
        Task<IReadOnlyList<CustomerDropdownModel>> GetCustomerDropdowns(CustomerDropdownListFilters request);
        Task<int> WriteAnalyticsReportSearchLog(UserAnalyticSearchLogModel model);
    }
}
