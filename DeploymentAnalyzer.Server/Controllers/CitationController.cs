using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitationController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public CitationController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        /// <summary>
        /// Retrieves a list of all citation with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CitationModel"/> objects.</returns>
        [HttpPost("GetCitation")]
        public async Task<ApiResponse<List<CitationModel>>> GetCitation(GetCitationRequest request)
        {
            var apiResponse = new ApiResponse<List<CitationModel>>();
            try
            {
                var data = await _unitOfWork.Citation.GetCitationAsync(request);
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
        /// Adds Update Citation.
        /// </summary>
        /// <param name="request">The details of the citation to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUpdateCitation")]
        public async Task<ApiResponse<int>> AddUpdateCitation(CitationRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Citation.AddUpdateCitationAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data> 0 ? "Citation details added." : "Failed to add Citation";
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
        /// Deletes a citation by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the citation to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteCitation")]
        public async Task<ApiResponse<int>> DeleteCitation(DeleteCitationRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Citation.DeleteCitationAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Citation record deleted." : "Failed to delete the citation";
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
        /// Retrieves a list of all citation Manager with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CitationModel"/> objects.</returns>
        [HttpPost("GetCitationManager")]
        public async Task<ApiResponse<List<CitationModel>>> GetCitationManager(GetCitationManagerRequest request)
        {
            var apiResponse = new ApiResponse<List<CitationModel>>();
            try
            {
                var data = await _unitOfWork.Citation.GetCitationManagerAsync(request);
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
        /// Retrieves a list of all citation with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CitationModel"/> objects.</returns>
        [HttpPost("GetCitationsForDM")]
        public async Task<ApiResponse<List<CitationModel>>> GetCitationsForDM(BaseRequest request)
        {
            var apiResponse = new ApiResponse<List<CitationModel>>();
            try
            {
                var data = await _unitOfWork.Citation.GetCitationsForDMAsync(request);
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
        /// Retrieves a list of all citation with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CitationSmallModel"/> objects.</returns>
        [HttpPost("GetCitationsByIdCSV")]
        public async Task<ApiResponse<List<CitationSmallModel>>> GetCitationsByIdCSV(GetCitationByIdCSVRequest request)
        {
            var apiResponse = new ApiResponse<List<CitationSmallModel>>();
            try
            {
                var data = await _unitOfWork.Citation.GetCitationsByIdCSVAsync(request);
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
