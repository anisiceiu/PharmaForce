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
    public class CompanyController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public CompanyController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all companies with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyModel"/> objects.</returns>
        [HttpGet("GetAllCompany")]
        public async Task<ApiResponse<List<CompanyModel>>> GetAllCompany()
        {
            var apiResponse = new ApiResponse<List<CompanyModel>>();

            try
            {
                var data = await _unitOfWork.Company.GetAllCompanyAsync();
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
        /// Retrieves the details of a specific company by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the company.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="CompanyModel"/> for the specified ID.</returns>
        [HttpGet("GetCompanyById/{Id}")]
        public async Task<ApiResponse<CompanyModel>> GetCompanyById(long Id)
        {
            var apiResponse = new ApiResponse<CompanyModel>();

            try
            {
                var data = await _unitOfWork.Company.GetCompanyByIdAsync(Id);
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
        /// Adds a new company.
        /// </summary>
        /// <param name="request">The details of the company to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddCompany")]
        public async Task<ApiResponse<int>> AddCompany(CompanyAddRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Company.AddCompanyAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Company details added." : "Failed to add company";
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
        /// Updates the details of an existing company.
        /// </summary>
        /// <param name="companyModel">The updated company details.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("UpdateCompany")]
        public async Task<ApiResponse<int>> UpdateCompany(CompanyModel companyModel)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Company.UpdateCompanyAsync(companyModel);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Company details updated." : "Failed to update company.";
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
        /// Deletes a company by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the company to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteCompany/{Id}")]
        public async Task<ApiResponse<int>> DeleteCompany(long Id)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.Company.DeleteCompanyAsync(Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Company record deleted." : "Failed to delete the company";
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
        /// Retrieves a list of all companies.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyModel"/> objects.</returns>
        [HttpGet("GetAdminCompanies")]
        public async Task<ApiResponse<List<CompanyModel>>> GetAdminCompanies()
        {
            var apiResponse = new ApiResponse<List<CompanyModel>>();

            try
            {
                var data = await _unitOfWork.Company.GetAdminCompaniesAsync();
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
