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
    public class ProductProfileController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductProfileController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Retrieves a list of all product with their details for product-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductProfileRequest"/> objects.</returns>
        [HttpPost("GetProductForProfileList")]
        public async Task<ApiResponse<List<ProductProfileModel>>> GetProductForProfileList(ProductProfileRequest request)
        {
            var apiResponse = new ApiResponse<List<ProductProfileModel>>();

            try
            {
                var data = await _unitOfWork.ProductProfile.GetProductForProfileListAsync(request);
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
        /// Add or remove favorite for product-profile grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="AddRemoveFavoriteProductRequest"/> objects.</returns>

        [HttpPost("AddRemoveFavoriteForProduct")]
        public async Task<ApiResponse<int>> AddRemoveFavoriteForProduct(AddRemoveFavoriteProductRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.ProductProfile.AddRemoveFavoriteProductAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                if (data == 1)
                {
                    apiResponse.Message = "Product added to favorite";
                }
                else if (data == 2)
                {
                    apiResponse.Message = "Product removed to favorite";
                }

                else if (data == 3)
                {
                    apiResponse.Message = "You can't add more than 5 product to favorite";
                }

                else
                {
                    apiResponse.Message = "Failed to update favorite status for product.";
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
        /// SubscribeUnSubscribeFavoriteProduct grid based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="SubscribeUnSubscribeFavoriteProductRequest"/> objects.</returns>

        [HttpPost("SubscribeUnSubscribeFavoriteProduct")]
        public async Task<ApiResponse<int>> SubscribeUnSubscribeFavoriteProduct(SubscribeUnSubscribeFavoriteProductRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.ProductProfile.SubscribeUnSubscribeFavoriteProductAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Successfully Saved.": "Could not save.";
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
        /// Retrieves a list of all favourite products with their name based on user Id.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="FavoriteProductListRequest"/> objects.</returns>
        [HttpPost("GetFavoriteProductList")]
        public async Task<ApiResponse<List<ProductProfileModel>>> GetFavoriteProductList(FavoriteProductListRequest request)
        {
            var apiResponse = new ApiResponse<List<ProductProfileModel>>();

            try
            {
                var data = await _unitOfWork.ProductProfile.GetFavoriteProductListAsync(request);
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
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductProfileDataModel"/> objects.</returns>
        [HttpPost("GetProductProfileRecords")]
        public async Task<ApiResponse<List<ProductProfileDataModel>>> GetProductProfileRecordsAsync(ProductProfileListRequest request)
        {
            var apiResponse = new ApiResponse<List<ProductProfileDataModel>>();

            try
            {
                var data = await _unitOfWork.ProductProfile.GetProductProfileRecordsAsync(request);
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
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="ProductProfileTopInfoModel"/> objects.</returns>
        [HttpPost("GetProductProfileTopInfo")]
        public async Task<ApiResponse<ProductProfileTopInfoModel>> GetProductProfileTopInfo(ProductProfileListRequest request)
        {
            var apiResponse = new ApiResponse<ProductProfileTopInfoModel>();

            try
            {
                var data = await _unitOfWork.ProductProfile.GetProductProfileTopInfoAsync(request);
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
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="TherapeuticCategoryWiseProductInfoModel"/> objects.</returns>
        [HttpPost("GetTherapeuticCategoryWiseProductInfo")]
        public async Task<ApiResponse<List<TherapeuticCategoryWiseProductInfoModel>>> GetTherapeuticCategoryWiseProductInfoAsync(ProductProfileListRequest request)
        {
            var apiResponse = new ApiResponse<List<TherapeuticCategoryWiseProductInfoModel>>();

            try
            {
                var data = await _unitOfWork.ProductProfile.GetTherapeuticCategoryWiseProductInfoAsync(request);
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
        public async Task<ApiResponse<List<AdditionalNote>>> GetAdditionalNoteList(ProductProfileListRequest request)
        {
            var apiResponse = new ApiResponse<List<AdditionalNote>>();

            try
            {
                var data = await _unitOfWork.ProductProfile.GetAdditionalNoteListAsync(request);
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
