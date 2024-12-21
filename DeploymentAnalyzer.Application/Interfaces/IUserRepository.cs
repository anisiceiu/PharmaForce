using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IUserRepository : IGenericRepository<UserModel>
    {
      //  Task<IReadOnlyList<UserModel>> GetUser();
        Task<IReadOnlyList<UserModel>> GetUserExpiry();
        Task<IReadOnlyList<UserModel>> GetAdminUserAsync();

        Task<IReadOnlyList<UserModel>> GetQueryUserAsync();
        Task<UserAddUpdateResult> AddUserAsync(UserAddRequest entity);
        Task<UserAddUpdateResult> UpdateUserAsync(UserModel entity);

        Task<int> UpdateUserExpiryAsync(UserExpiryModel entity);
        Task<int> DisableAdminUsersAsync(UserChangeActionRequest request);
        Task<int> RemoveAdminUsersAsync(UserChangeActionRequest request);
    //    Task<IReadOnlyList<CompanyModel>> Admin_GetCompaniesAsync();
        Task<IReadOnlyList<UserModel>> GetAllUsersAsync();
        Task<IReadOnlyList<UserModel>> GetUsersAsync();
        Task<UserVerifyLoginResult> VerifyAndGetUserAsync(LoginRequest request);
        Task<int> AddClientVerificationCode(int clientId, string emailAddress, string OTP);
        Task<UserModel?> ActivateClient(int clientID, string OTP);
        Task<int> DeleteUserAsync(UserChangeActionRequest request);
        Task<TryAddUserClientResult> TryAddNewUserClientAsync(LoginRequest request);
        Task<UserModel?> GetAdminUserAsync(string username,string email);
        int SendOTPToClient(int clientId, string emailAddress, string OTP);
    }
}
