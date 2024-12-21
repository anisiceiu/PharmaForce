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
    public class CompanyProfileController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public CompanyProfileController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all companies with their details for company-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyProfileRequest"/> objects.</returns>
        [HttpPost("GetCompanyForProfileList")]
        public async Task<ApiResponse<List<CompanyProfileModel>>> GetCompanyForProfileList(CompanyProfileRequest request)
        {
            var apiResponse = new ApiResponse<List<CompanyProfileModel>>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetCompanyForProfileListAsync(request);
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
        /// Add or remove favorite for company-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="AddRemoveFavoriteCompanyRequest"/> objects.</returns>

        [HttpPost("AddRemoveFavoriteForCompany")]
        public async Task<ApiResponse<int>> AddRemoveFavoriteForCompany(AddRemoveFavoriteCompanyRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.AddRemoveFavoriteCompanyAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                if (data == 1) {
                    apiResponse.Message = "Company added to favorite";
                }
                else if (data == 2) {
                    apiResponse.Message = "Company removed to favorite";
                }

                else if (data == 3)
                {
                    apiResponse.Message = "You can't add more than 5 company to favorite";
                }

                else {
                    apiResponse.Message = "Failed to update favorite status for company.";
                } 
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
        /// SubscribeUnSubscribeFavoriteCompany grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="SubscribeUnSubscribeFavoriteProductRequest"/> objects.</returns>

        [HttpPost("SubscribeUnSubscribeFavoriteCompany")]
        public async Task<ApiResponse<int>> SubscribeUnSubscribeFavoriteCompany(SubscribeUnSubscribeFavoriteCompanyRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.SubscribeUnSubscribeFavoriteCompanyAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Successfully Saved." : "Could not save.";
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
        /// Retrieves a list of all companies with their details for company-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyProfileRequest"/> objects.</returns>
        [HttpPost("GetCountryList")]
        public async Task<ApiResponse<List<CountryModel>>> GetCountryList(CountryForCompanyProfileModel request)
        {
            var apiResponse = new ApiResponse<List<CountryModel>>();

            try
            {
                var data = await _unitOfWork.Country.GetCountriesAsync(request);
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
        /// Retrieves a list of all companies with their details for company-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="FavoriteCompanyListRequest"/> objects.</returns>
        [HttpPost("GetFavoriteCompanyList")]
        public async Task<ApiResponse<List<CompanyProfileModel>>> GetFavoriteCompanyList(FavoriteCompanyListRequest request)
        {
            var apiResponse = new ApiResponse<List<CompanyProfileModel>>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetFavoriteCompanyListAsync(request);
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
        /// Retrieves a list of all product profile data.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyProfileDataModel"/> objects.</returns>
        [HttpPost("GetCompanyProfileRecords")]
        public async Task<ApiResponse<List<CompanyProfileDataModel>>> GetCompanyProfileRecordsAsync(CompanyProfileListRequest request)
        {
            var apiResponse = new ApiResponse<List<CompanyProfileDataModel>>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetCompanyProfileRecordsAsync(request);
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
        /// Retrieves a company profile data.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductProfileTopInfoModel"/> objects.</returns>
        [HttpPost("GetCompanyProfileTopInfo")]
        public async Task<ApiResponse<CompanyProfileTopInfoModel>> GetCompanyProfileTopInfo(CompanyProfileListRequest request)
        {
            var apiResponse = new ApiResponse<CompanyProfileTopInfoModel>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetCompanyProfileTopInfoAsync(request);
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
        /// Retrieves a list of all product profile data.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="TherapeuticCategoryWiseCompanyInfoModel"/> objects.</returns>
        [HttpPost("GetTherapeuticCategoryWiseCompanyInfo")]
        public async Task<ApiResponse<List<TherapeuticCategoryWiseCompanyInfoModel>>> GetTherapeuticCategoryWiseCompanyInfoAsync(CompanyProfileListRequest request)
        {
            var apiResponse = new ApiResponse<List<TherapeuticCategoryWiseCompanyInfoModel>>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetTherapeuticCategoryWiseCompanyInfoAsync(request);
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
        /// Retrieves a list of all product profile data.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="AdditionalNote"/> objects.</returns>
        [HttpPost("GetAdditionalNoteList")]
        public async Task<ApiResponse<List<AdditionalNote>>> GetAdditionalNoteList(CompanyProfileListRequest request)
        {
            var apiResponse = new ApiResponse<List<AdditionalNote>>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetAdditionalNoteListAsync(request);
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
        /// Retrieves a list of all product profile data.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="AdditionalNote"/> objects.</returns>
        [HttpPost("AddUpdateCompanyProductProfileUserPreference")]
        public async Task<ApiResponse<int>> AddUpdateCompanyProductProfileUserPreference(AddUpdateCompanyProductProfileUserPreferenceRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.AddUpdateCompanyProductProfileUserPreference(request);
                apiResponse.Status = data > 0;
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
        /// Retrieves a list of all product profile data.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyProductProfileUserFilterModel"/> objects.</returns>
        [HttpPost("GetCompanyProductProfileUserPreferences")]
        public async Task<ApiResponse<List<CompanyProductProfileUserFilterModel>>> GetCompanyProfileUserPreferences(CompanyProductProfileUserPreferenceRequest request)
        {
            var apiResponse = new ApiResponse<List<CompanyProductProfileUserFilterModel>>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetCompanyProductProfileUserPreferences(request);
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
        /// Retrieves a list of all companies with their Get Company Update Info based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyUpdateInfoModel"/> objects.</returns>
        [HttpPost("GetCompanyUpdateInfo")]
        public async Task<ApiResponse<List<CompanyUpdateInfoModel>>> GetCompanyUpdateInfo(BaseRequest request)
        {
            var apiResponse = new ApiResponse<List<CompanyUpdateInfoModel>>();

            try
            {
                var data = await _unitOfWork.CompanyProfile.GetCompanyUpdateInfoAsync(request);
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
