using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public BrandController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all key updates with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="MyBrandModel"/> objects.</returns>
        [HttpPost("GetMyBrandGroups")]
        public async Task<ApiResponse<List<MyBrandModel>>> GetMyBrandGroups(BaseRequest request)
        {
            var apiResponse = new ApiResponse<List<MyBrandModel>>();

            try
            {
                var data = await _unitOfWork.MyBrandRepository.GetMyBrandGroupsAsync(request);
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

        [HttpPost("AddUpdateMyBrandGroup")]
        public async Task<ApiResponse<int>> AddUpdateMyBrandGroup(AddUpdateMyBrandRequest myBrandRequest)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.MyBrandRepository.AddUpdateMyBrandAsync(myBrandRequest);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Brand group saved" : "Not able to save brand group";
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
        [HttpDelete("DeleteMyBrandGroup/{Id}")]
        public async Task<ApiResponse<int>> DeleteMyBrand(long Id)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.MyBrandRepository.DeleteMyBrandAsync(Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Brand Group record deleted." : "Failed to delete the brand group";
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
        /// Retrieves a list of all GetBrandGroupFilters Records filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="IEnumerable<IdNamePair>"/> objects.</returns>
        [HttpPost("GetBrandGroupFilters")]
        public async Task<ApiResponse<IEnumerable<IdNamePair>>> GetBrandGroupFilters(BrandGroupFilterRequest request)
        {
            var apiResponse = new ApiResponse<IEnumerable<IdNamePair>>();

            try
            {
                var data = await _unitOfWork.MyBrandRepository.GetBrandGroupFiltersAsync(request);
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
        /// Retrieves a GetCompanyTherapeuticBrandAssociation item.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="IEnumerable<CompanyTherapeuticBrandAssociationModel>"/> objects.</returns>
        [HttpPost("GetCompanyTherapeuticBrandAssociation")]
        public async Task<ApiResponse<CompanyTherapeuticBrandAssociationModel>> GetCompanyTherapeuticBrandAssociation(CompanyTherapeuticBrandAssociationRequest request)
        {
            var apiResponse = new ApiResponse<CompanyTherapeuticBrandAssociationModel>();

            try
            {
                var data = await _unitOfWork.MyBrandRepository.GetCompanyTherapeuticBrandAssociation(request.myBrandId);
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
        /// Retrieves a list of all key updates with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="GenericNameModel"/> objects.</returns>
        [HttpPost("GetGenericNames")]
        public async Task<ApiResponse<List<GenericNameModel>>> GetGenericNames(GetGenericNameRequest request)
        {
            var apiResponse = new ApiResponse<List<GenericNameModel>>();

            try
            {
                var data = await _unitOfWork.GenericNameRepository.GetGenericNameListAsync(request);
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
