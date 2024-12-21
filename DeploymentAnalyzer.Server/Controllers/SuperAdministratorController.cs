using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Infrastructure.Repository;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Text.Json.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuperAdministratorController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGraphServiceClientFactory _graphServiceClientFactory;
        private readonly IGraphB2CServiceClientFactory _graphB2CServiceClientFactory;
        private readonly IGraphService _graphService;
        public SuperAdministratorController(IUnitOfWork unitOfWork, IGraphServiceClientFactory graphServiceClientFactory, IGraphService graphService,
                          IGraphB2CServiceClientFactory graphB2CServiceClientFactory)
        {
            _unitOfWork = unitOfWork;
            _graphServiceClientFactory = graphServiceClientFactory;
            _graphB2CServiceClientFactory = graphB2CServiceClientFactory;
            _graphService = graphService;
        }

        /// <summary>
        /// Retrieves a list of all users with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserModel"/> objects.</returns>
        [HttpGet("GetAdminUser")]
        public async Task<ApiResponse<List<UserModel>>> GetAdminUserAsync()
        {
            var apiResponse = new ApiResponse<List<UserModel>>();

            try
            {
                var data = await _unitOfWork.User.GetAdminUserAsync();
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
        /// Retrieves a list of all users with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserModel"/> objects.</returns>
        [HttpGet("GetClientUser")]
        public async Task<ApiResponse<List<UserModel>>> GetClientUserAsync()
        {
            var apiResponse = new ApiResponse<List<UserModel>>();

            try
            {
                var data = await _unitOfWork.User.GetQueryUserAsync();
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

        [HttpGet("GetUserExpiry")]
        public async Task<ApiResponse<List<UserModel>>> GetUserExpiry()
        {
            var apiResponse = new ApiResponse<List<UserModel>>();

            try
            {
                var data = await _unitOfWork.User.GetUserExpiry();
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
        /// Adds a new User.
        /// </summary>
        /// <param name="request">The details of the User to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUser")]
        public async Task<ApiResponse<int>> AddUser(UserAddRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.User.AddUserAsync(request);

                if (data.AffectedRows > 0)
                {
                    var user = await _unitOfWork.User.GetAdminUserAsync(request.UserName, request.Email?? "");

                    if (user != null && user.Id > 0)
                    {
                        user.Password = request.Password;
                        var graphClient = _graphB2CServiceClientFactory.GetB2CAuthenticatedGraphClient();
                        var UserDetails = await _graphService.GetUserDetails(graphClient);
                        //var ifuserExists = UserDetails.Where(x => x.email == user.Email).FirstOrDefault();
                        var ifuserExists = UserDetails.Where(x => (x.email != null && user.Email != null && x.email.ToLower() == user.Email?.ToLower())).FirstOrDefault();
                        if (ifuserExists is null)
                        {
                            //need to add it in azure b2c
                          string message =  await _graphService.AddUserAzureDetails(graphClient, user);

                            if (message.ToLower().Contains("error"))
                            {
                                apiResponse.Status =  false;
                                apiResponse.Message = message;
                                apiResponse.Result = data.AffectedRows;

                                return apiResponse;
                            }
                        }
                    }
                }
                apiResponse.Status = data.AffectedRows > 0 ? true : false;
                apiResponse.Message = data.AffectedRows > 0 ? "User details added." : (string.IsNullOrEmpty(data.Message) ? "Failed to add User" : data.Message);
                apiResponse.Result = data.AffectedRows;
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
        /// Updates the details of an existing User.
        /// </summary>
        /// <param name="userModel">The updated User details.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("UpdateUser")]
        public async Task<ApiResponse<int>> UpdateUser(UserModel userModel)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.User.UpdateUserAsync(userModel);
                apiResponse.Status = data.AffectedRows > 0 ? true : false;
                apiResponse.Message = data.AffectedRows > 0 ? "User details updated." :( string.IsNullOrEmpty(data.Message) ? "Failed to update User." : data.Message);
                apiResponse.Result = data.AffectedRows;
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
        /// Updates the expiry of an existing user.
        /// </summary>
        /// <param name="userExpiryModel">The updated user details.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>

        [HttpPut("UpdateUserExpiry")]
        public async Task<ApiResponse<int>> UpdateUserExpiry(UserExpiryModel userExpiryModel)
        {
            var apiResponse = new ApiResponse<int>();
            try
            {
                var data = await _unitOfWork.User.UpdateUserExpiryAsync(userExpiryModel);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User Expiry updated." : "Failed to update User Expiry.";
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
        /// Enable/ Disable the User.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="UserModel"/> for the specified ID.</returns>
        [HttpPut("DisableAdminUser")]
        public async Task<ApiResponse<int>> DisableAdminUsers(UserChangeActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.User.DisableAdminUsersAsync(request);
                apiResponse.Status = data >= 0 ? true : false;
                apiResponse.Message = data == 1 ? "User Enabled." : data == 0 ? "User Disabled." : "Failed to Updated the Status.";
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
        /// Deletes a User by its ID.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("RemoveAdminUser")]
        public async Task<ApiResponse<int>> RemoveAdminUser(UserChangeActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.User.RemoveAdminUsersAsync(request);
                if (data > 0)
                {
                    var graphClient = _graphB2CServiceClientFactory.GetB2CAuthenticatedGraphClient();
                    
                    if (request.Email != null)
                    {
                        var message = await _graphService.DeleteUserAzureDetails(graphClient, request.Email);
                    }
                    
                }
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User record deleted." : "Failed to delete the user";
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
        /// Retrieves a list of all user with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserModel"/> objects.</returns>
        [HttpGet("GetUser")]
        public async Task<ApiResponse<List<UserModel>>> GetUsers()
        {
            var apiResponse = new ApiResponse<List<UserModel>>();
            try
            {
                var data = await _unitOfWork.User.GetUsersAsync();
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
        /// Retrieves a list of all companies with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyModel"/> objects.</returns>
        [HttpPost("Admin_GetCompany")]
        public async Task<ApiResponse<List<CompanyModel>>> GetCompanies(AdminRequest request)
        {
            var apiResponse = new ApiResponse<List<CompanyModel>>();
            try
            {
                var data = await _unitOfWork.Company.GetAdminCompaniesAsync(request.user_id, request.security_token);
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
        /// Retrieves a list of all countries with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CountryModel"/> objects.</returns>
        [HttpPost("Admin_GetCountry")]
        public async Task<ApiResponse<List<CountryModel>>> GetCountries(AdminRequest request)
        {
            var apiResponse = new ApiResponse<List<CountryModel>>();
            try
            {
                var data = await _unitOfWork.Country.GetAdminCountriesAsync(request.user_id, request.security_token);
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
        /// Retrieves a list of all functions with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="AdminFunctionModel"/> objects.</returns>
        [HttpPost("Admin_GetFunction")]
        public async Task<ApiResponse<List<AdminFunctionModel>>> GetFunctions(AdminRequest request)
        {
            var apiResponse = new ApiResponse<List<AdminFunctionModel>>();
            try
            {
                var data = await _unitOfWork.Admin.AdminGetFunctionsAsync(request);
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
        /// Retrieves a list of all CompanyCountry with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CompanyCountryModel"/> objects.</returns>
        [HttpGet("GetAllCompanyCountry")]
        public async Task<ApiResponse<List<CompanyCountryModel>>> GetAllCompanyCountry(int user_id)
        {
            var apiResponse = new ApiResponse<List<CompanyCountryModel>>();
            try
            {
                var data = await _unitOfWork.CompanyCountry.GetAllCompanyCountryAsync(user_id);
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
        /// Adds a new AdminPermission.
        /// </summary>
        /// <param name="request">The details of the AdminPermission to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddAdminPermission")]
        public async Task<ApiResponse<int>> AddAdminPermission(AdminPermissionAddRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.AdminPermission.AddAdminPermissionAsync(request);
                apiResponse.Status = data < 0 ? true : false;
                apiResponse.Message = data < 0 ? "Admin Permission details added." : "Failed to add Admin Permission";
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

        /*
                [HttpGet("Admin_GetCompanies")]
                    public async Task<ApiResponse<List<CompanyModel>>> Admin_GetCompanies()
                    {
                        var apiResponse = new ApiResponse<List<CompanyModel>>();

                        try
                     {
                         var data = await _unitOfWork.Company.AdminGetCompaniesAsync();
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
                }*/

        /// <summary>
        /// Updates a AdminPermission.
        /// </summary>
        /// <param name="request">The details of the AdminPermission to update.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("UpdateAdminPermission")]
        public async Task<ApiResponse<int>> UpdateAdminPermission(AdminPermissionModel request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.AdminPermission.UpdateAdminPermissionAsync(request);
                apiResponse.Status = data < 0 ? true : false;
                apiResponse.Message = data < 0 ? "Admin Permission details updated." : "Failed to update Admin Permission";
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
        /// Retrieves a AdminPermission with their details.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="AdminPermissionModel"/> objects.</returns>
        [HttpGet("GetAdminPermissionByUserID/{Id}")]
        public async Task<ApiResponse<AdminPermissionModel>> GetAdminPermissionByUserID(long Id)
        {
            var apiResponse = new ApiResponse<AdminPermissionModel>();
            try
            {
                var data = await _unitOfWork.AdminPermission.GetAdminPermissionByUserIdAsync(Id);
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
        /// Retrieves a list of all dep_users.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DepUserModel"/> objects.</returns>
        [HttpGet("GetDepUser")]
        public async Task<ApiResponse<List<DepUserModel>>> GetDepUser()
        {
            var apiResponse = new ApiResponse<List<DepUserModel>>();

            try
            {
                var data = await _unitOfWork.DepUser.GetAllDepUserAsync();
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
        /// Unlock the User.
        /// </summary>
        /// <param name="id">The unique identifier of the dep_user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="DepUserModel"/> for the specified ID.</returns>
        [HttpPut("UnlockUser")]
        public async Task<ApiResponse<int>> UnlockUser(IdNamePair pair)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DepUser.UnlockUserAsync(pair.Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User Unlocked Successfully." : "Failed to Unlock User.";
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
        /// Retrieves a list of all UserEmailSuffix by UserId.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserEmailSuffixModel"/> objects.</returns>
        [HttpPost("GetUserEmailSuffix")]
        public async Task<ApiResponse<List<UserEmailSuffixModel>>> GetUserEmailSuffix(IdNamePair user)
        {
            var apiResponse = new ApiResponse<List<UserEmailSuffixModel>>();

            try
            {
                var data = await _unitOfWork.UserEmailSuffix.GetUserEmailSuffixAsync(user.Id);
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
        /// Adds a new UserEmailSuffix.
        /// </summary>
        /// <param name="request">The details of the UserEmailSuffix to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUserEmailSuffix")]
        public async Task<ApiResponse<int>> AddUserEmailSuffix(UserEmailSuffixAddRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserEmailSuffix.AddUserEmailSuffixAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User Email Suffix added." : "Failed to add User Email Suffix";
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
        /// Deletes a User Email Suffix by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("RemoveUserEmailSuffix")]
        public async Task<ApiResponse<int>> RemoveUserEmailSuffix(IdNamePair pair)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserEmailSuffix.DeleteUserEmailSuffixAsync(pair.Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User email suffix deleted." : "Failed to delete the user email suffix";
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
        /// Retrieves a list of all UserEmailSuffix by UserId.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserRestrictedEmailSuffixModel"/> objects.</returns>
        [HttpPost("GetUserRestrictedEmailSuffix")]
        public async Task<ApiResponse<List<UserRestrictedEmailSuffixModel>>> GetUserRestrictedEmailSuffix(IdNamePair user)
        {
            var apiResponse = new ApiResponse<List<UserRestrictedEmailSuffixModel>>();

            try
            {
                var data = await _unitOfWork.UserEmailSuffix.GetUserRestrictedEmailSuffixAsync(user.Id);
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
        /// Adds a new UserEmailSuffix.
        /// </summary>
        /// <param name="request">The details of the UserEmailSuffix to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUserRestrictedEmailSuffix")]
        public async Task<ApiResponse<int>> AddUserRestrictedEmailSuffix(UserRestrictedEmailSuffixAddRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserEmailSuffix.AddUserRestrictedEmailSuffixAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User Email Suffix added." : "Failed to add User Email Suffix";
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
        /// Deletes a User Email Suffix by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("RemoveUserRestrictedEmailSuffix")]
        public async Task<ApiResponse<int>> RemoveUserRestrictedEmailSuffix(IdNamePair pair)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserEmailSuffix.DeleteUserRestrictedEmailSuffixAsync(pair.Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User email suffix deleted." : "Failed to delete the user email suffix";
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
        /// Retrieves a list of all users.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserModel"/> objects.</returns>
        [HttpGet("GetAllUsers")]
        public async Task<ApiResponse<List<UserModel>>> GetAllUsers()
        {
            var apiResponse = new ApiResponse<List<UserModel>>();

            try
            {
                var data = await _unitOfWork.User.GetAllUsersAsync();
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
        /// Retrieves a list of all countries.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CountryModel"/> objects.</returns>
        [HttpGet("GetAdminCountries")]
        public async Task<ApiResponse<List<CountryModel>>> GetAdminCountries()
        {
            var apiResponse = new ApiResponse<List<CountryModel>>();

            try
            {
                var data = await _unitOfWork.Country.GetAdminCountriesAsync();
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
        /// Retrieves a list of all periods.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="PeriodModel"/> objects.</returns>
        [HttpGet("GetAdminPeriods")]
        public async Task<ApiResponse<List<PeriodModel>>> GetAdminPeriods()
        {
            var apiResponse = new ApiResponse<List<PeriodModel>>();

            try
            {
                var data = await _unitOfWork.Period.GetAdminPeriodsAsync();
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
        /// Retrieves a list of all periods.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="TherapeuticCategoryModel"/> objects.</returns>
        [HttpGet("GetAdminTherapeuticCategories")]
        public async Task<ApiResponse<List<TherapeuticCategoryModel>>> GetAdminTherapeuticCategories()
        {
            var apiResponse = new ApiResponse<List<TherapeuticCategoryModel>>();

            try
            {
                var data = await _unitOfWork.TherapeuticCategory.GetAdminTherapeuticCategoriesAsync();
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
        /// Retrieves a list of all UserRights by UserId.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserRightsModel"/> objects.</returns>
        [HttpPost("GetUserRights")]
        public async Task<ApiResponse<UserRightsModel>> GetUserRights(IdNamePair user)
        {
            var apiResponse = new ApiResponse<UserRightsModel>();

            try
            {
                var data = await _unitOfWork.UserRights.GetUserRightsByUserIdAsync(user.Id);
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
        /// Update a User Rights by its userId.
        /// </summary>
        /// <param name="id">The unique identifier of the user to update.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("AddOrUpdateUserRights")]
        public async Task<ApiResponse<int>> AddOrUpdateUserRightsAsync(UserRightsModel userRights)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserRights.UpdateUserRightsAsync(userRights);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User rights updated." : "Failed to update the user rights.";
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
        /// Retrieves a list of all GetUserClients by UserId.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserClientModel"/> objects.</returns>
        [HttpPost("GetUserClients")]
        public async Task<ApiResponse<List<UserClientModel>>> GetUserClients(IdNamePair user)
        {
            var apiResponse = new ApiResponse<List<UserClientModel>>();

            try
            {
                var data = await _unitOfWork.UserClient.GetUserClientsAsync(user.Id);
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
        /// Adds a new AddUserClient.
        /// </summary>
        /// <param name="request">The details of the AddUserClient to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUserClient")]
        public async Task<ApiResponse<string>> AddUserClient(UserClientAddRequest request)
        {
            var apiResponse = new ApiResponse<string>();

            try
            {
                var message = await _unitOfWork.UserClient.AddUserClientAsync(request);
                apiResponse.Status = (message == "Email suffix not allowed." || message == "Client added successfully." || message == "Client already exists.") ? true : false;
                apiResponse.Message = (message == "Email suffix not allowed." || message == "Client added successfully." || message == "Client already exists.") ? message : "Failed to add User Client";
                apiResponse.Result = message;
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
        /// WaiveActivationToClient UserClient.
        /// </summary>
        /// <param name="id">The unique identifier of the dep_user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="UserClientModel"/> for the specified ID.</returns>
        [HttpPut("WaiveActivationToClient")]
        public async Task<ApiResponse<int>> WaiveActivationToClient(UserClientActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserClient.WaiveActivationToClientAsync(request.user_id, request.ClientId, request.WaiveFlag);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Saved Successfully." : "Failed to Save.";
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
        /// ActiveDeactiveToClient UserClient.
        /// </summary>
        /// <param name="id">The unique identifier of the dep_user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="UserClientModel"/> for the specified ID.</returns>
        [HttpPut("ActiveDeactiveToClient")]
        public async Task<ApiResponse<int>> ActiveDeactiveToClient(UserClientActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserClient.ActiveDeactiveToClientAsync(request.user_id,request.ClientId, request.ActiveFlag);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Saved Successfully." : "Failed to Save.";
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
        /// UnsubscribeClient UserClient.
        /// </summary>
        /// <param name="id">The unique identifier of the dep_user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="UserClientModel"/> for the specified ID.</returns>
        [HttpPut("UnsubscribeClient")]
        public async Task<ApiResponse<int>> UnsubscribeClient(UserClientActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserClient.UnsubscribeClientAsync(request.user_id,request.ClientId, request.UnsubscribeFlag);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Saved Successfully." : "Failed to Save.";
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
        /// LockUnlockClientAccount UserClient.
        /// </summary>
        /// <param name="id">The unique identifier of the dep_user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="UserClientModel"/> for the specified ID.</returns>
        [HttpPut("LockUnlockClientAccount")]
        public async Task<ApiResponse<int>> LockUnlockClientAccount(UserClientActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserClient.LockUnlockClientAccountAsync(request.user_id,request.ClientEmailId, request.LockStatus, request.LockUnlockTime);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Saved Successfully." : "Failed to Save.";
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
        /// Deletes a User Client by its ID.
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("RemoveUserClient")]
        public async Task<ApiResponse<int>> RemoveUserClient(UserClientActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserClient.RemoveUserClientAsync(request.ClientId);
                if(data > 0)
                {
                    var graphClient = _graphB2CServiceClientFactory.GetB2CAuthenticatedGraphClient();

                    if (!string.IsNullOrEmpty(request.ClientEmailId))
                    {
                        var message = await _graphService.DeleteUserAzureDetails(graphClient, request.ClientEmailId);
                    }

                }
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User Client deleted." : "Failed to delete the User Client.";
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
        /// Adds a User Preference for a perticular grid in a page.
        /// </summary>
        /// <param name="request">The details of the User to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddUserPreference")]
        public async Task<ApiResponse<int>> AddUserPreference(UserPreferenceModel request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                //request.FilterSettings = JsonConvert.SerializeObject(request.DataManagerFilter);
                //request.ColumnSettings = JsonConvert.SerializeObject(request.ColumnSettingList);

                var data = await _unitOfWork.UserPreference.AddOrUpdateUserPreferencesAsync(request);
                apiResponse.Status = true;
                apiResponse.Message = true ? "User preferences details added." : "Failed to add User preferences";
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
        /// Retrieves a list of all Get User Preferences by UserId and pageID.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserPreferenceModel"/> objects.</returns>
        [HttpPost("GetUserPreferences")]
        public async Task<ApiResponse<List<UserPreferenceModel>>> GetUserPreferences(UserPreferenceRequest request)
        {
            var apiResponse = new ApiResponse<List<UserPreferenceModel>>();

            try
            {
                var data = await _unitOfWork.UserPreference.GetUserPreferencesAsync(request.UserId, request.PageId);
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
        /// Retrieves a list of all Get GetAdminLog.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="AdminLogModel"/> objects.</returns>
        [HttpPost("GetAdminLog")]
        public async Task<ApiResponse<List<AdminLogModel>>> GetAdminLog(BaseRequest request)
        {
            var apiResponse = new ApiResponse<List<AdminLogModel>>();

            try
            {
                var data = await _unitOfWork.AdminLog.GetAdminLogAsync(request);
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
        /// Deletes a User by its ID.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("DeleteUser")]
        public async Task<ApiResponse<int>> DeleteUserAsync(UserChangeActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.User.DeleteUserAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "User record deleted." : "Failed to delete the user";
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
        /// Retrieves Login Details of users.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="UserLoginDetail"/> objects.</returns>
        [HttpGet("GetUserLoginDetail")]
        public async Task<ApiResponse<List<UserLoginDetail>>> GetUserLoginDetail()
        {
            var apiResponse = new ApiResponse<List<UserLoginDetail>>();

            try
            {
                var data = await _unitOfWork.UserLoginDetails.GetUserLoginDetail();
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
