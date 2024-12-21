using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class MasterCodeController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterCodeController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        /// <summary>
        /// Retrieves a list of all MasterCode with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="MasterCodeModel"/> objects.</returns>
        [HttpPost("GetMasterCodeByCategory")]
        public async Task<ApiResponse<List<MasterCodeModel>>> GetMasterCodeByCategory(MasterCodeModel request)
        {
            var apiResponse = new ApiResponse<List<MasterCodeModel>>();
            try
            {
                var data = await _unitOfWork.MasterCode.GetMasterCodeByCategory(request);
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
        /// Retrieves a list of all MasterCode with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="MasterCodeModel"/> objects.</returns>
        [HttpPost("GetMasterCodeAllCategories")]
        public async Task<ApiResponse<List<string>>> GetMasterCodeAllCategories()
        {
            var apiResponse = new ApiResponse<List<string>>();
            try
            {
                var data = await _unitOfWork.MasterCode.GetMasterCodeAllCategories();
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
        /// Retrieves a list of all MasterCode with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="MasterCodeModel"/> objects.</returns>
        [HttpPost("GetMasterCode")]
        public async Task<ApiResponse<List<MasterCodeModel>>> GetMasterCode()
        {
            var apiResponse = new ApiResponse<List<MasterCodeModel>>();
            try
            {
                var data = await _unitOfWork.MasterCode.GetMasterCodeAsync();
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
        /// Adds Update MasterCode.
        /// </summary>
        /// <param name="request">The details of the MasterCode to add and update.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUpdateMasterCode")]
        public async Task<ApiResponse<int>> AddUpdateMasterCode(MasterCodeRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var result = await _unitOfWork.MasterCode.AddUpdateMastercodeAsync(request);
                apiResponse.Status = result.row_affected > 0 ? true : false;
                apiResponse.Message = string.IsNullOrEmpty(result.message) ? "Master Code details added." : "Master Code " + request.name + " With Category " + request.category + " Already Exists.";
                apiResponse.Result = result.row_affected;
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
        /// Deletes a MasterCode by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the MasterCode to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteMasterCode/{Id}")]
        public async Task<ApiResponse<int>> DeleteMasterCode(long Id, int userId)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.MasterCode.DeleteMasterCodeAsync(Id, userId);
                apiResponse.Status = data> 0 ? true : false;
                apiResponse.Message = data > 0 ? "MasterCode record deleted." : "Failed to delete the MasterCode";
                apiResponse.Result = data;
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
        /// Retrieves a Current Period.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="MasterCodeModel"/> objects.</returns>
        [HttpPost("GetAdminCurrentPeriod")]
        public async Task<ApiResponse<MasterCodeModel>> GetAdminCurrentPeriod(BaseRequest request)
        {
            var apiResponse = new ApiResponse<MasterCodeModel>();
            try
            {
                var data = await _unitOfWork.MasterCode.GetAdminCurrentPeriodAsync(request.user_id,request.security_token);
                apiResponse.Status = true;
                apiResponse.Result = data;
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
        /// Retrieves a list of all Master code add filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="IEnumerable<IdNamePair>"/> objects.</returns>
        [HttpPost("GetMasterCodeAddFilters")]
        public async Task<ApiResponse<IEnumerable<IdNamePair>>> GetMasterCodeAddFilters(MasterCodeFilterRequest request)
        {
            var apiResponse = new ApiResponse<IEnumerable<IdNamePair>>();

            try
            {
                var data = await _unitOfWork.MasterCode.GetMasterCodeAddFilters(request.type);
                apiResponse.Status = true;
                apiResponse.Result = data;
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
        /// Retrieves a list of all Master code filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="IEnumerable<IdNamePair>"/> objects.</returns>
        [HttpPost("GetMasterCodeFilters")]
        public async Task<ApiResponse<IEnumerable<IdNamePair>>> GetMasterCodeFilters(MasterCodeFilterRequest request)
        {
            var apiResponse = new ApiResponse<IEnumerable<IdNamePair>>();

            try
            {
                var data = await _unitOfWork.MasterCode.GetMasterCodeFiltersAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
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
        /// Retrieves a list of all MasterCode with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="MasterCodeModel"/> objects.</returns>
        [HttpPost("GetMasterCodeRecords")]
        public async Task<ApiResponse<List<MasterCodeModel>>> GetMasterCodeRecords(MasterCodeListRequest request)
        {
            var apiResponse = new ApiResponse<List<MasterCodeModel>>();
            try
            {
                var data = await _unitOfWork.MasterCode.GetMasterCodeRecordsAsync(request);
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
        /// Retrieves a list of all Master code add filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="IEnumerable<IdNamePair>"/> objects.</returns>
        [HttpPost("GetMasterCodeUSNameFilters")]
        public async Task<ApiResponse<IEnumerable<USNameOptions>>> GetMasterCodeUSNameFilters(MasterCodeFilterRequest request)
        {
            var apiResponse = new ApiResponse<IEnumerable<USNameOptions>>();

            try
            {
                var data = await _unitOfWork.MasterCode.GetMasterCodeUSNameFilters(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
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
