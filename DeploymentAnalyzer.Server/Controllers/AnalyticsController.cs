using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AnalyticsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of GetCompanyCountryAnalysisGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyCountryAnalysisGridDataModel"/> objects.</returns>
        [HttpPost("GetCompanyCountryAnalysisGridData")]
        public async Task<ApiResponse<List<CompanyCountryAnalysisGridDataModel>>> GetCompanyCountryAnalysisGridData(CompanyCountryAnalysisParams request)
        {
            var apiResponse = new ApiResponse<List<CompanyCountryAnalysisGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetCompanyCountryAnalysisGridDataAsync(request);
                
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(8, request.user_id,jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetCompanyCountryAnalysisChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyCountryAnalysisChartDataModel"/> objects.</returns>
        [HttpPost("GetCompanyCountryAnalysisChartData")]
        public async Task<ApiResponse<List<CompanyCountryAnalysisChartDataModel>>> GetCompanyCountryAnalysisChartData(CompanyCountryAnalysisParams request)
        {
            var apiResponse = new ApiResponse<List<CompanyCountryAnalysisChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetCompanyCountryAnalysisChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetCompanyDeploymentByCountryPCAndSpecialtyGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyDeploymentByCountryPCAndSpecialtyGridDataModel"/> objects.</returns>
        [HttpPost("GetCompanyDeploymentByCountryPCAndSpecialtyGridData")]
        public async Task<ApiResponse<List<CompanyDeploymentByCountryPCAndSpecialtyGridDataModel>>> GetCompanyDeploymentByCountryPCAndSpecialtyGridData(CompanyDeploymentByCountryPCAndSpecialtyParams request)
        {
            var apiResponse = new ApiResponse<List<CompanyDeploymentByCountryPCAndSpecialtyGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetCompanyDeploymentByCountryPCAndSpecialtyGridDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(1, request.user_id, jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetCompanyDeploymentByCountryPCAndSpecialtyChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyDeploymentByCountryPCAndSpecialtyChartDataModel"/> objects.</returns>
        [HttpPost("GetCompanyDeploymentByCountryPCAndSpecialtyChartData")]
        public async Task<ApiResponse<List<CompanyDeploymentByCountryPCAndSpecialtyChartDataModel>>> GetCompanyDeploymentByCountryPCAndSpecialtyChartData(CompanyDeploymentByCountryPCAndSpecialtyParams request)
        {
            var apiResponse = new ApiResponse<List<CompanyDeploymentByCountryPCAndSpecialtyChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetCompanyDeploymentByCountryPCAndSpecialtyChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetTotalCompanyDeploymentByCountryAndTCGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="TotalCompanyDeploymentByCountryAndTCGridDataModel"/> objects.</returns>
        [HttpPost("GetTotalCompanyDeploymentByCountryAndTCGridData")]
        public async Task<ApiResponse<List<TotalCompanyDeploymentByCountryAndTCGridDataModel>>> GetTotalCompanyDeploymentByCountryAndTCGridData(TotalCompanyDeploymentByCountryAndTCParams request)
        {
            var apiResponse = new ApiResponse<List<TotalCompanyDeploymentByCountryAndTCGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetTotalCompanyDeploymentByCountryAndTCGridDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(2, request.user_id, jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetTotalCompanyDeploymentByCountryAndTCChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="TotalCompanyDeploymentByCountryAndTCChartDataModel"/> objects.</returns>
        [HttpPost("GetTotalCompanyDeploymentByCountryAndTCChartData")]
        public async Task<ApiResponse<List<TotalCompanyDeploymentByCountryAndTCChartDataModel>>> GetTotalCompanyDeploymentByCountryAndTCChartData(TotalCompanyDeploymentByCountryAndTCParams request)
        {
            var apiResponse = new ApiResponse<List<TotalCompanyDeploymentByCountryAndTCChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetTotalCompanyDeploymentByCountryAndTCChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetCompanyPortfolioByTCAndSalesForceGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyPortfolioByTCAndSalesForceGridDataModel"/> objects.</returns>
        [HttpPost("GetCompanyPortfolioByTCAndSalesForceGridData")]
        public async Task<ApiResponse<List<CompanyPortfolioByTCAndSalesForceGridDataModel>>> GetCompanyPortfolioByTCAndSalesForceGridData(CompanyPortfolioByTCAndSalesForceParams request)
        {
            var apiResponse = new ApiResponse<List<CompanyPortfolioByTCAndSalesForceGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetCompanyPortfolioByTCAndSalesForceGridDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(3, request.user_id, jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetCompanyPortfolioByTCAndSalesForceChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyPortfolioByTCAndSalesForceChartDataModel"/> objects.</returns>
        [HttpPost("GetCompanyPortfolioByTCAndSalesForceChartData")]
        public async Task<ApiResponse<List<CompanyPortfolioByTCAndSalesForceChartDataModel>>> GetCompanyPortfolioByTCAndSalesForceChartData(CompanyPortfolioByTCAndSalesForceParams request)
        {
            var apiResponse = new ApiResponse<List<CompanyPortfolioByTCAndSalesForceChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetCompanyPortfolioByTCAndSalesForceChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetProductFTEsByTCAndSalesForceUsingBrandNameGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductFTEsByTCAndSalesForceUsingBrandNameGridDataModel"/> objects.</returns>
        [HttpPost("GetProductFTEsByTCAndSalesForceUsingBrandNameGridData")]
        public async Task<ApiResponse<List<ProductFTEsByTCAndSalesForceUsingBrandNameGridDataModel>>> GetProductFTEsByTCAndSalesForceUsingBrandNameGridData(ProductFTEsByTCAndSalesForceUsingBrandNameParams request)
        {
            var apiResponse = new ApiResponse<List<ProductFTEsByTCAndSalesForceUsingBrandNameGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetProductFTEsByTCAndSalesForceUsingBrandNameGridDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(4, request.user_id, jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetProductFTEsByTCAndSalesForceUsingBrandNameChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductFTEsByTCAndSalesForceUsingBrandNameChartDataModel"/> objects.</returns>
        [HttpPost("GetProductFTEsByTCAndSalesForceUsingBrandNameChartData")]
        public async Task<ApiResponse<List<ProductFTEsByTCAndSalesForceUsingBrandNameChartDataModel>>> GetProductFTEsByTCAndSalesForceUsingBrandNameChartData(ProductFTEsByTCAndSalesForceUsingBrandNameParams request)
        {
            var apiResponse = new ApiResponse<List<ProductFTEsByTCAndSalesForceUsingBrandNameChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetProductFTEsByTCAndSalesForceUsingBrandNameChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetProductFTEsByTCAndSalesForceUsingGenericNameGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductFTEsByTCAndSalesForceUsingGenericNameGridDataModel"/> objects.</returns>
        [HttpPost("GetProductFTEsByTCAndSalesForceUsingGenericNameGridData")]
        public async Task<ApiResponse<List<ProductFTEsByTCAndSalesForceUsingGenericNameGridDataModel>>> GetProductFTEsByTCAndSalesForceUsingGenericNameGridData(ProductFTEsByTCAndSalesForceUsingGenericNameParams request)
        {
            var apiResponse = new ApiResponse<List<ProductFTEsByTCAndSalesForceUsingGenericNameGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetProductFTEsByTCAndSalesForceUsingGenericNameGridDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(5, request.user_id, jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetProductFTEsByTCAndSalesForceUsingGenericNameChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductFTEsByTCAndSalesForceUsingGenericNameChartDataModel"/> objects.</returns>
        [HttpPost("GetProductFTEsByTCAndSalesForceUsingGenericNameChartData")]
        public async Task<ApiResponse<List<ProductFTEsByTCAndSalesForceUsingGenericNameChartDataModel>>> GetProductFTEsByTCAndSalesForceUsingGenericNameChartData(ProductFTEsByTCAndSalesForceUsingGenericNameParams request)
        {
            var apiResponse = new ApiResponse<List<ProductFTEsByTCAndSalesForceUsingGenericNameChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetProductFTEsByTCAndSalesForceUsingGenericNameChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetSalesRepresentativeCompensationBySalesForceAndProductGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="SalesRepresentativeCompensationBySalesForceAndProductGridDataModel"/> objects.</returns>
        [HttpPost("GetSalesRepresentativeCompensationBySalesForceAndProductGridData")]
        public async Task<ApiResponse<List<SalesRepresentativeCompensationBySalesForceAndProductGridDataModel>>> GetSalesRepresentativeCompensationBySalesForceAndProductGridData(SalesRepresentativeCompensationBySalesForceAndProductParams request)
        {
            var apiResponse = new ApiResponse<List<SalesRepresentativeCompensationBySalesForceAndProductGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetSalesRepresentativeCompensationBySalesForceAndProductGridDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(6, request.user_id, jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetSalesRepresentativeCompensationBySalesForceAndProductChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="SalesRepresentativeCompensationBySalesForceAndProductChartDataModel"/> objects.</returns>
        [HttpPost("GetSalesRepresentativeCompensationBySalesForceAndProductChartData")]
        public async Task<ApiResponse<List<SalesRepresentativeCompensationBySalesForceAndProductChartDataModel>>> GetSalesRepresentativeCompensationBySalesForceAndProductChartData(SalesRepresentativeCompensationBySalesForceAndProductParams request)
        {
            var apiResponse = new ApiResponse<List<SalesRepresentativeCompensationBySalesForceAndProductChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetSalesRepresentativeCompensationBySalesForceAndProductChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetReachAndFrequencyBySalesForceAndProductGridData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ReachAndFrequencyBySalesForceAndProductGridDataModel"/> objects.</returns>
        [HttpPost("GetReachAndFrequencyBySalesForceAndProductGridData")]
        public async Task<ApiResponse<List<ReachAndFrequencyBySalesForceAndProductGridDataModel>>> GetReachAndFrequencyBySalesForceAndProductGridData(ReachAndFrequencyBySalesForceAndProductParams request)
        {
            var apiResponse = new ApiResponse<List<ReachAndFrequencyBySalesForceAndProductGridDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetReachAndFrequencyBySalesForceAndProductGridDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();

                string jsonfilters = JsonConvert.SerializeObject(request);
                await WriteReportSearchLogAsync(7, request.user_id, jsonfilters);
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetReachAndFrequencyBySalesForceAndProductChartData.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ReachAndFrequencyBySalesForceAndProductChartDataModel"/> objects.</returns>
        [HttpPost("GetReachAndFrequencyBySalesForceAndProductChartData")]
        public async Task<ApiResponse<List<ReachAndFrequencyBySalesForceAndProductChartDataModel>>> GetReachAndFrequencyBySalesForceAndProductChartData(ReachAndFrequencyBySalesForceAndProductParams request)
        {
            var apiResponse = new ApiResponse<List<ReachAndFrequencyBySalesForceAndProductChartDataModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetReachAndFrequencyBySalesForceAndProductChartDataAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of GetCustomerDropdowns.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CustomerDropdownModel"/> objects.</returns>
        [HttpPost("GetCustomerDropdowns")]
        public async Task<ApiResponse<List<CustomerDropdownModel>>> GetCustomerDropdowns(CustomerDropdownListFilters request)
        {
            var apiResponse = new ApiResponse<List<CustomerDropdownModel>>();

            try
            {
                var data = await _unitOfWork.AnalyticsRepository.GetCustomerDropdowns(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;

            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;

            }

            return apiResponse;
        }


        /// <summary>
        /// Adds a User filters for a perticular grid in a page.
        /// </summary>
        /// <param name="request">The details of the User to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("SaveUserAnalyticFilters")]
        public async Task<ApiResponse<int>> SaveUserAnalyticFilters(UserAnalyticFilterModel request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserPreference.AddOrUpdateUserAnalyticFiltersAsync(request);
                apiResponse.Status = true;
                apiResponse.Message = true ? "Filters Saved." : "Failed to Save";
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of all Get User Filters by UserId and reportID.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserAnalyticFilterModel"/> objects.</returns>
        [HttpPost("GetUserAnalyticFilters")]
        public async Task<ApiResponse<List<UserAnalyticFilterModel>>> GetUserAnalyticFilters(UserAnalyticFilterRequest request)
        {
            var apiResponse = new ApiResponse<List<UserAnalyticFilterModel>>();

            try
            {
                var data = await _unitOfWork.UserPreference.GetUserAnalyticFiltersAsync(request.UserId,request.client_id);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
            }

            return apiResponse;
        }

        private async Task WriteReportSearchLogAsync(int reportId,int userId, string jsonfilters)
        {
            UserAnalyticSearchLogModel model = new UserAnalyticSearchLogModel()
            {
                UserId =userId,
                CreatedDate = DateTime.Now,
                FilterSettings = jsonfilters,
                ReportId = reportId
            };

            await _unitOfWork.AnalyticsRepository.WriteAnalyticsReportSearchLog(model);
        }

        /// <summary>
        /// Deletes a KeyUdpate by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the keyUpdate to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteUserAnalyticFilter/{Id}")]
        public async Task<ApiResponse<int>> DeleteUserAnalyticFilter(long Id)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserPreference.DeleteUserAnalyticFiltersAsync(Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Deleted Successfully." : "Could not delete";
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
            }

            return apiResponse;
        }
    }
}
