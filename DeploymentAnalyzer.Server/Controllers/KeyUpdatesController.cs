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
    public class KeyUpdatesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public KeyUpdatesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all key updates with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="KeyUpdateManagementModel"/> objects.</returns>
        [HttpGet("GetKeyUpdates")]
        public async Task<ApiResponse<List<KeyUpdateManagementModel>>> GetKeyUpdate(int user_id)
        {
            var apiResponse = new ApiResponse<List<KeyUpdateManagementModel>>();

            try
            {
                var data = await _unitOfWork.KeyUpdateManagement.GetKeyUpdatesAsync(user_id);
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
        /// Adds a new key update.
        /// </summary>
        /// <param name="udpate model">The details of the key update to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>

        [HttpPost("AddUpdateKeyUpdate")]
        public async Task<ApiResponse<int>> AddKeyUpdate(UpdateManagementAddRequest updateModel)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.KeyUpdateManagement.AddUpdateKeyAsync(updateModel);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Key Update saved" : "Not able to add key udpate";
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
        /// Deletes a KeyUdpate by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the keyUpdate to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteKeyUpdate/{Id}")]
        public async Task<ApiResponse<int>> DeleteKeyUpdate(long Id)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.KeyUpdateManagement.DeleteKeyUpdateAsync(Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Key Update record deleted." : "Failed to delete the key update";
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
        /// Retrieves a list of all key updates with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="KeyUpdateTagModel"/> objects.</returns>
        [HttpGet("GetKeyUpdateTags")]
        public async Task<ApiResponse<List<KeyUpdateTagModel>>> GetKeyUpdateTags(int user_id)
        {
            var apiResponse = new ApiResponse<List<KeyUpdateTagModel>>();

            try
            {
                var data = await _unitOfWork.KeyUpdateManagement.GetKeyUpdateTagsAsync(user_id);
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
        /// Retrieves a list of all key updates with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="KeyUpdateManagementModel"/> objects.</returns>
        [HttpPost("GetKeyUpdateList")]
        public async Task<ApiResponse<List<KeyUpdateManagementModel>>> GetKeyUpdateList(KeyUpdateRequest request)
        {
            var apiResponse = new ApiResponse<List<KeyUpdateManagementModel>>();

            try
            {
                var data = await _unitOfWork.KeyUpdateManagement.GetKeyUpdateListAsync(request);
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
        /// Update Event Email Config.
        /// </summary>
        /// <param name="udpate model">The details of the key update to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>

        [HttpPost("UpdateEventEmailConfig")]
        public async Task<ApiResponse<int>> UpdateEventEmailConfig(EventEmailConfigModel emailConfig)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Admin.UpdateEventEmailConfig(emailConfig);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "saved Successfully." : "Not able to save.";
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
        /// Retrieves a list of all GetAllEventEmailConfig with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="EventEmailConfigModel"/> objects.</returns>
        [HttpPost("GetAllEventEmailConfig")]
        public async Task<ApiResponse<List<EventEmailConfigModel>>> GetAllEventEmailConfig(BaseRequest request)
        {
            var apiResponse = new ApiResponse<List<EventEmailConfigModel>>();

            try
            {
                var data = await _unitOfWork.Admin.GetEventEmailConfigsAsync(request);
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
