using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using System.Reflection;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.AspNetCore.SignalR.Protocol;
using Microsoft.Graph.Models;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGraphServiceClientFactory _graphServiceClientFactory;
        private readonly IGraphB2CServiceClientFactory _graphB2CServiceClientFactory;
        private readonly IGraphService _graphService;
        private readonly IGraphMailService _graphMailService;
        public AccountController(IUnitOfWork unitOfWork, IGraphServiceClientFactory graphServiceClientFactory, IGraphService graphService,
                          IGraphB2CServiceClientFactory graphB2CServiceClientFactory, IGraphMailService graphMailService)
        {
            _unitOfWork = unitOfWork;
            _graphServiceClientFactory = graphServiceClientFactory;
            _graphB2CServiceClientFactory = graphB2CServiceClientFactory;
            _graphService = graphService;
            _graphMailService = graphMailService;
        }

        /// <summary>
        /// Authenticates a user by their credentials and generates a login token.
        /// </summary>
        /// <param name="request">The login credentials of the user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a login token upon successful authentication.</returns>
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<ApiResponse<string>> Login(LoginRequest request)
        {
            var apiResponse = new ApiResponse<string>();

            try
            {
                var data = await _unitOfWork.Account.LoginUser(request);
                apiResponse.Status = data == "0" ? false : true;
                apiResponse.Message = data == "0" ? "Not a valid credentials" : "Credentials Authenticated";
                apiResponse.Result = data;

                if (apiResponse.Status)
                {
                    HttpContext.Session.SetString("UserName", request.UserName ?? request.EmailAddress);
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
        /// Authenticates a user by their credentials and generates a login token.
        /// </summary>
        /// <param name="request">The login credentials of the user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a login token upon successful authentication.</returns>
        [HttpPost("CheckUser")]
        [AllowAnonymous]
        public async Task<ApiResponse<ClientLoginFirstStepResult>> CheckUser(LoginRequest request)
        {
            var apiResponse = new ApiResponse<ClientLoginFirstStepResult>();

            try
            {
                ClientLoginFirstStepResult result = new ClientLoginFirstStepResult();
                bool flag = false;
                request.IsAdmin = false;
                var verifyResult = await _unitOfWork.User.VerifyAndGetUserAsync(request);
                var user = verifyResult.User;

                if (user == null || (user != null && user.ClientId == 0))//client not in DB
                {
                   var try_result = await _unitOfWork.User.TryAddNewUserClientAsync(request);

                    if (try_result != null && try_result.User != null && try_result.User.ClientId > 0)
                    {
                        user = try_result.User;
                    }
                    else 
                    {
                        apiResponse.Status = false;
                        apiResponse.Message = (try_result?.Message) ?? "Not a valid credentials";
                        apiResponse.Result = result;

                        return apiResponse;
                    }
                }

                if (user != null)
                {
                    flag = true;
                    if (user.WaiveActivation)
                    {
                        if (user.VerificationDate != null)
                        {
                            result.IsReVerificationNeeded = false;
                        }
                        else {
                            result.IsReVerificationNeeded = true;
                            Random generator = new Random();
                            string otp = generator.Next(0, 100000).ToString("D5");

                            await _unitOfWork.User.AddClientVerificationCode(user.ClientId, user.Email ?? "", otp);
                            if (user.Email != null)
                            {
                                await this._graphMailService.SendOTPToClientEmailAsync(user.Email, otp);
                            }
                            
                        }
                        
                    }
                    else 
                    {
                        if (user.VerificationDate == null || (user.VerificationDate != null && (DateTime.Now - user.VerificationDate.Value).TotalDays > 28))
                        {
                            result.IsReVerificationNeeded = true;
                            Random generator = new Random();
                            string otp = generator.Next(0, 100000).ToString("D5");

                            await _unitOfWork.User.AddClientVerificationCode(user.ClientId, user.Email ?? "", otp);
                            if (user.Email != null)
                            {
                                await this._graphMailService.SendOTPToClientEmailAsync(user.Email, otp);
                            }
                        }
                        else 
                        {
                            result.IsReVerificationNeeded = false;
                        }
                        
                    }

                    result.CompanyUserId = user.Id;
                    result.ClientId = user.ClientId;
                    result.EmailAddress = request.EmailAddress;
                    result.CompanyCode = request.Password;

                    if (result.IsReVerificationNeeded == false)
                    {
                        LoginRequest logReq = new LoginRequest() { EmailAddress = result.EmailAddress, UserName = user.UserName };
                        result.Token = await _unitOfWork.Account.GetJWTToken(logReq, user.UserType ?? "U");
                        if (result.Token != null)
                        {
                            result.User = new UserModel { Id = result.CompanyUserId, ClientId = result.ClientId, Name = result.EmailAddress, Email = result.EmailAddress, UserName = result.EmailAddress, UserType = "U", Password = result.CompanyCode };
                            result.User.UserRights = await _unitOfWork.UserRights.GetUserRightsByUserIdAsync(result.CompanyUserId);
                        }
                    }
                }

                apiResponse.Status = flag ? true : false;
                apiResponse.Message = !flag ? "Not a valid credentials" : "Credentials Authenticated";
                apiResponse.Result = result;                
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
        /// Authenticates a user by their credentials and generates a login token.
        /// </summary>
        /// <param name="request">The login credentials of the user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a login token upon successful authentication.</returns>
        [HttpPost("VerifyOTP")]
        [AllowAnonymous]
        public async Task<ApiResponse<UserLogInResult>> VerifyOTP(OTPVerificationRequest request)
        {
            var apiResponse = new ApiResponse<UserLogInResult>();

            try
            {
                UserLogInResult result = new UserLogInResult();

                if (request == null || request.OTP == null || request.OTP.Length != 5 || request.ClientId == 0)
                {
                    apiResponse.Result = result;
                    apiResponse.Status = false;
                    apiResponse.Message = "INVALID";

                    return apiResponse;
                }


                var user = await _unitOfWork.User.ActivateClient(request.ClientId, request.OTP);

                if (user != null)
                {
                    LoginRequest logReq = new LoginRequest() { EmailAddress = request.EmailAddress, UserName = user.UserName };
                    result.Token = await _unitOfWork.Account.GetJWTToken(logReq, user.UserType ?? "U");

                        if (result.Token != null)
                        {   
                            result.User = new UserModel { Id = request.CompanyUserId, ClientId = request.ClientId, Name = request.EmailAddress, Email = request.EmailAddress, UserName = request.EmailAddress, UserType = "U", Password = request.CompanyCode };
                            result.User.UserRights = await _unitOfWork.UserRights.GetUserRightsByUserIdAsync(request.CompanyUserId);

                        if (request.IsB2CEnabled)
                        {
                            var graphClient = _graphB2CServiceClientFactory.GetB2CAuthenticatedGraphClient();
                            var UserDetails = await _graphService.GetUserDetails(graphClient);
                            var ifuserExists = UserDetails.Where(x => x.email == request.EmailAddress).FirstOrDefault();
                            if (ifuserExists is null)
                            {
                                //need to add it in azure b2c
                                var message = await _graphService.AddUserAzureDetails(graphClient, result.User);
                                if (message.ToLower().Contains("error"))
                                {
                                    result.User = null;
                                    result.Token = null;
                                    apiResponse.Status = result.User == null ? false : true;
                                    apiResponse.Message = result.User == null ? message : "Credentials Authenticated";
                                    apiResponse.Result = result;

                                    return apiResponse;
                                }
                            }
                        }
                    }
                 
                }

                apiResponse.Status = result.User == null ? false : true;
                apiResponse.Message = result.User == null ? "Not a valid OTP" : "Credentials Authenticated";
                apiResponse.Result = result;
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
        [HttpPost("LockClientAccount")]
        public async Task<ApiResponse<int>> LockClientAccount(UserClientActionRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.UserClient.LockUnlockClientAccountAsync(request.user_id, request.ClientEmailId, request.LockStatus, request.LockUnlockTime,true);
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
        /// Authenticates a user by their credentials and generates a login token.
        /// </summary>
        /// <param name="request">The login credentials of the user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a login token upon successful authentication.</returns>
        [HttpPost("ProceedClientLogin")]
        [AllowAnonymous]
        public async Task<ApiResponse<UserLogInResult>> ProceedClientLogin(ProceedClientRequest request)
        {
            var apiResponse = new ApiResponse<UserLogInResult>();

            try
            {
                UserLogInResult result = new UserLogInResult();

                if (request != null && request.ClientId > 0 && !string.IsNullOrEmpty(request.EmailAddress))
                {
                    LoginRequest logReq = new LoginRequest() { EmailAddress = request.EmailAddress, UserName = request.EmailAddress };
                    result.Token = await _unitOfWork.Account.GetJWTToken(logReq,"U");

                    if (result.Token != null)
                    {   //use client id as user Id
                        result.User = new UserModel { Id=request.CompanyUserId,ClientId=request.ClientId,Name=request.EmailAddress,Email=request.EmailAddress,UserName=request.EmailAddress, UserType="U" ,Password=request.CompanyCode};
                        result.User.UserRights = await _unitOfWork.UserRights.GetUserRightsByUserIdAsync(request.CompanyUserId);

                        if (request.IsB2CEnabled)
                        {
                            var graphClient = _graphB2CServiceClientFactory.GetB2CAuthenticatedGraphClient();
                            var UserDetails = await _graphService.GetUserDetails(graphClient);
                            if (UserDetails is not null)
                            {
                                var ifuserExists = UserDetails.Where(x => x.email == request.EmailAddress).FirstOrDefault();
                                if (ifuserExists is null)
                                {
                                    //need to add it in azure b2c
                                    var message = await _graphService.AddUserAzureDetails(graphClient, result.User);
                                    if (message.ToLower().Contains("error"))
                                    {
                                        result.User = null;
                                        result.Token = null;
                                        apiResponse.Status = result.User == null ? false : true;
                                        apiResponse.Message = result.User == null ? message : "Credentials Authenticated";
                                        apiResponse.Result = result;

                                        return apiResponse;
                                    }
                                }
                            }
                        }
                    }


                }

                apiResponse.Status = result.User == null ? false : true;
                apiResponse.Message = result.User == null ? "Not a valid OTP" : "Credentials Authenticated";
                apiResponse.Result = result;
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
        /// Authenticates a admin user by their credentials and generates a login token.
        /// </summary>
        /// <param name="request">The login credentials of the user.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a login token upon successful authentication.</returns>
        [HttpPost("AdminLogin")]
        [AllowAnonymous]
        public async Task<ApiResponse<UserLogInResult>> AdminLogin(LoginRequest request)
        {
            var apiResponse = new ApiResponse<UserLogInResult>();

            try
            {

                UserLogInResult result = new UserLogInResult();
                request.IsAdmin = true;
                var verifyResult = await _unitOfWork.User.VerifyAndGetUserAsync(request);
                var user = verifyResult.User;

                if (user != null)
                {
                    if (user.Enabled == false)
                    {
                        apiResponse.Status = false;
                        apiResponse.Message = "User is disabled";
                    }
                    else
                    {
                        result.Token = await _unitOfWork.Account.GetJWTToken(request, user.UserType ?? "A");

                        if (result.Token != null)
                        {
                            user.Password = request.Password;
                            result.User = user;

                            if (request.IsB2CEnabled)
                            {
                                var graphClient = _graphB2CServiceClientFactory.GetB2CAuthenticatedGraphClient();
                                var UserDetails = await _graphService.GetUserDetails(graphClient);
                                var ifuserExists = UserDetails.Where(x => (x.email !=null && user.Email !=null && x.email.ToLower() == user.Email?.ToLower())).FirstOrDefault();
                                if (ifuserExists is null)
                                {
                                    //need to add it in azure b2c
                                   var message = await _graphService.AddUserAzureDetails(graphClient, result.User);

                                    if(message.ToLower().Contains("error"))
                                    {
                                        result.User = null;
                                        result.Token = null;
                                        apiResponse.Status = result.User == null ? false : true;
                                        apiResponse.Message = result.User == null ? message : "Credentials Authenticated";

                                        return apiResponse;
                                    }

                                }
                            }
                        }
                        apiResponse.Status = result.User == null ? false : true;
                        apiResponse.Message = result.User == null ? "Not a valid credentials" : "Credentials Authenticated";
                    }
                }
                else
                {
                    apiResponse.Status = false;
                    apiResponse.Message = string.IsNullOrEmpty(verifyResult.Message) ? "Not a valid credentials" : verifyResult.Message;
                }

                apiResponse.Result = result;
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


        [HttpPost("RefreshToken")]
        [AllowAnonymous]
        public async Task<ApiResponse<string>> RefreshToken()
        {
            var apiResponse = new ApiResponse<string>();

            try
            {
                var data = await _unitOfWork.Account.RefreshToken();
                apiResponse.Status = true;
                apiResponse.Message = "Credentials Authenticated";
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
