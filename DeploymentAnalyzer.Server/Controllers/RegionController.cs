using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public RegionController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all companies with their details for company-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyProfileRequest"/> objects.</returns>
        [HttpPost("GetRegionList")]
        public async Task<ApiResponse<List<RegionModel>>> GetRegionList(RegionListRequest request)
        {
            var apiResponse = new ApiResponse<List<RegionModel>>();

            try
            {
                var data = await _unitOfWork.Region.GetRegionListAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of all companies with their details for company-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyProfileRequest"/> objects.</returns>
        [HttpPost("GetRegionListHavingCountry")]
        public async Task<ApiResponse<List<RegionModel>>> GetRegionListHavingCountry(RegionListRequest request)
        {
            var apiResponse = new ApiResponse<List<RegionModel>>();

            try
            {
                var data = await _unitOfWork.Region.GetRegionListOnlyHasCountryAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

    }
}
