using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Globalization;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class NotesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGraphMailService _graphMailService;
        public NotesController(IUnitOfWork unitOfWork, IGraphMailService graphMailService)
        {
            _unitOfWork = unitOfWork;
            _graphMailService = graphMailService;
        }

        [HttpGet("SendTestEmail")]
        [AllowAnonymous]
        public async Task<ApiResponse<string>> SendTestEmail()
        {
            var apiResponse = new ApiResponse<string>();
            string toAddress = "anisictiu@gmail.com";
            string subject = "Another Test Email using Graph API";
            string body = "<p>An HTML BODY email from our Deployment Analyzer application.<br/>This Is a test Email from Azure Graph service for testing purpose.<br/>We are sending this email using noreply@theratraq.com email address</p>";

            var result = await this._graphMailService.SendEmailAsync(toAddress,subject,body);
            apiResponse.Result = result ? "Email Successfully Sent" : "Failed to send email";
            apiResponse.Status = result;
            return apiResponse;
        }
        /// <summary>
        /// Retrieves a list of all Notes with their details. 
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="NotesModel"/> objects.</returns>
        [HttpPost("GetNotes")]
        public async Task<ApiResponse<List<NotesModel>>> GetNotes(NoteListRequest request)
        {
            var apiResponse = new ApiResponse<List<NotesModel>>();
            try
            {
                var data = await _unitOfWork.Notes.GetNotesAsync(request);
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
        /// Adds Update Notes.
        /// </summary>
        /// <param name="request">The details of the Notes to add and Update.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUpdateNotes")]
        public async Task<ApiResponse<int>> AddUpdateNotes(NotesRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Notes.AddUpdateNotesAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Notes details added." : "Failed to add Notes";
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
        /// Deletes a notes by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the notes to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteNotes/{Id}")]
        public async Task<ApiResponse<int>> DeleteNotes(long Id, int userId)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Notes.DeleteNotesAsync(Id, userId);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Notes record deleted." : "Failed to delete the Notes";
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
