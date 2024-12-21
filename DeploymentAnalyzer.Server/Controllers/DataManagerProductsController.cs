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
    public class DataManagerProductsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public DataManagerProductsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        /// <summary>
        /// Retrieves a list of all data manager items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DataManagerProductModel"/> objects.</returns>
        [HttpPost("GetAllDataManagerProduct")]
        public async Task<ApiResponse<List<DataManagerProductModel>>> GetAllDataManagerProduct(DataManagerProductsRequest request)
        {
            var apiResponse = new ApiResponse<List<DataManagerProductModel>>();

            try
            {
                var data = await _unitOfWork.DataManagerProduct.GetAllDataManagerProductsAsync(request);
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
        /// Deletes a DeleteDMProductRecord .
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("DeleteDMProductRecord")]
        public async Task<ApiResponse<int>> DeleteDMProductRecord(DataManagerDeleteRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DataManagerProduct.DeleteDMProductRecordAsync(request.DADatabase_Product_Id);

                apiResponse.Status = true;
                apiResponse.Message = true ? "Product Record deleted." : "Failed to delete the Product Record.";
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
