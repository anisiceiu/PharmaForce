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
    public class QCQueuesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public QCQueuesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all QCQueues with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="QCQueuesModel"/> objects.</returns>
        [HttpPost("GetQCQueues")]
        public async Task<ApiResponse<QCQueueListResponse>> GetQCQueues(QCQueueListRequest request)
        {
            var apiResponse = new ApiResponse<QCQueueListResponse>();
            try
            {
                var data = await _unitOfWork.QCQueues.GetQCQueuesAsync(request);
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
        /// Adds QCQueues.
        /// </summary>
        /// <param name="request">The details of the QCQueues to add </param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddQCQueues")]
        public async Task<ApiResponse<int>> AddQCQueues(QCQueuesRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.QCQueues.AddQCQueuesAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "QCQueues details added." : "Failed to add QCQueues";
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
        /// Approve QCQueues.
        /// </summary>
        /// <param name="request">The details of the QCQueues to approve </param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("ApproveQCQueues")]
        public async Task<ApiResponse<int>> ApproveQCQueues(ApproveQCQueuesRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.QCQueues.ApproveQCQueue(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "QCQueues details approved." : "Failed to approve QCQueues";
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
        /// Deletes a QCQueues by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the QCQueues to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("RejectQCQueues")]
        public async Task<ApiResponse<int>> RejectQCQueues(ApproveQCQueuesRequest request)
        {
            var apiResponse = new ApiResponse<int>();
            try
            {
                var data = await _unitOfWork.QCQueues.DeleteQCQueuesAsync(request.id, request.user_id);
                apiResponse.Status = data > 0? true : false;
                apiResponse.Message = data > 0 ? "QCQueues record deleted." : "Failed to delete the QCQueues";
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
        /// Retrieves a list of all QCQueuesHistory with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="QCQueuesModel"/> objects.</returns>
        [HttpPost("GetQCHistories")]
        public async Task<ApiResponse<QCQueueListResponse>> GetQCHistories(QCQueueHistoryListRequest request)
        {
            var apiResponse = new ApiResponse<QCQueueListResponse>();
            try
            {
                var data = await _unitOfWork.QCQueues.GetQCHistoriesAsync(request);
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
