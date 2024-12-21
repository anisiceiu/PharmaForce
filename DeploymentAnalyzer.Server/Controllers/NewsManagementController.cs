using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsManagementController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public NewsManagementController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all news articles with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="NewsManagementModel"/> objects.</returns>
        [HttpPost("GetAllNews")]
        public async Task<ApiResponse<List<NewsManagementModel>>> GetAllNews(BaseRequest request)
        {
            var apiResponse = new ApiResponse<List<NewsManagementModel>>();

            try
            {
                var data = await _unitOfWork.NewsManagement.GetAllNewsAsync(request);
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
        /// Retrieves the details of a specific news article by its ID.
        /// </summary>
        /// <param name="Id">The unique identifier of the news article.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="NewsManagementModel"/> for the specified ID.</returns>
        [HttpGet("GetNewsById/{Id}")]
        public async Task<ApiResponse<NewsManagementModel>> GetNewsById(long Id)
        {
            var apiResponse = new ApiResponse<NewsManagementModel>();

            try
            {
                var data = await _unitOfWork.NewsManagement.GetNewsByIdAsync(Id);
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
        /// Adds a new news article.
        /// </summary>
        /// <param name="newsModel">The details of the news article to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddNews")]
        public async Task<ApiResponse<int>> AddNews(NewsManagementAddRequest newsModel)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.NewsManagement.AddNewsAsync(newsModel);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "News added" : "Not able to add news";
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
        /// Updates the details of an existing news article.
        /// </summary>
        /// <param name="newsModel">The updated news article details.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("UpdateNews")]
        public async Task<ApiResponse<int>> UpdateNews(NewsManagementAddRequest newsModel)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.NewsManagement.UpdateNewsAsync(newsModel);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "News updated" : "Not able to update news";
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
        /// Deletes a news article by its ID.
        /// </summary>
        /// <param name="Id">The unique identifier of the news article to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteNews/{Id}")]
        public async Task<ApiResponse<int>> DeleteNews(long Id)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.NewsManagement.DeleteNewsAsync(Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Result = data;
                if (apiResponse.Status == true)
                {
                    apiResponse.Message = "News Deleted Successfully.";
                }
                else
                {
                    apiResponse.Message = "Not Deleted. Something Went Wrong.";
                }
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
        /// Retrieves a list of all news articles with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="NewsManagementModel"/> objects.</returns>
        [HttpPost("GetNewsList")]
        public async Task<ApiResponse<List<NewsManagementModel>>> GetNewsList(NewsRequest request)
        {
            var apiResponse = new ApiResponse<List<NewsManagementModel>>();

            try
            {
                var data = await _unitOfWork.NewsManagement.GetNewsListAsync(request);
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
