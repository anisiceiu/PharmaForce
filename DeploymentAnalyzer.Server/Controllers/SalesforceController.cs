using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesforceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public SalesforceController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all key updates with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="SalesforceModel"/> objects.</returns>
        [HttpPost("GetSalesforceList")]
        public async Task<ApiResponse<List<SalesforceModel>>> GetSalesforceList(GetSalesforceRequest request)
        {
            var apiResponse = new ApiResponse<List<SalesforceModel>>();

            try
            {
                var data = await _unitOfWork.SalesforceRepository.GetSalesforceListAsync(request);
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

    }
}
