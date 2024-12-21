using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class UserClientRepository : GenericRepository<UserClientModel>, IUserClientRepository
    {
        public UserClientRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<int> ActiveDeactiveToClientAsync(int user_id, int clientID, bool activeFlag)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@ClientID", clientID);
            parameters.Add("@ActiveFlag", activeFlag,System.Data.DbType.Boolean);

            return await UpdateAsync(parameters, StoreProcedures.ActiveDeactiveToClient);
        }

        public async Task<string> AddUserClientAsync(UserClientAddRequest request)
        {
            string message = string.Empty;
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", request.UserID);
            parameters.Add("@EmailID", request.EmailID);
            parameters.Add("@ActivationCode", request.ActivationCode);
            parameters.Add("@message", message,System.Data.DbType.String,System.Data.ParameterDirection.Output);
            try
            {
                await AddAsync(parameters, StoreProcedures.AddUserClient);
            }
            catch (Exception ex)
            {

                throw;
            }
            

            message = parameters.Get<string>("@message");

            return message;
        }

        public async Task<IReadOnlyList<UserClientModel>> GetUserClientsAsync(int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", userId);

            return await GetAllAsync(parameters, StoreProcedures.GetUserClientList);
        }
        public async Task<int> LockUnlockClientAccountAsync(int user_id, string clientEmailId, bool lockStatus, DateTime lockUnlockTime, bool isTemporaryLock=false)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id",user_id);
            parameters.Add("@ClientEmailId", clientEmailId);
            parameters.Add("@LockStatus", lockStatus);
            parameters.Add("@LockUnlockTime", lockUnlockTime);
            parameters.Add("@IsTemporaryLocked", isTemporaryLock);

            return await UpdateAsync(parameters, StoreProcedures.LockUnlockClientAccount);
        }

        public async Task<int> RemoveUserClientAsync(int clientId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@clientId", clientId);

            return await DeleteAsync(parameters, StoreProcedures.DeleteUserClient);
        }

        public async Task<int> UnsubscribeClientAsync(int user_id, int clientID, bool unsubscribeFlag)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@ClientID", clientID);
            parameters.Add("@UnsubscribeFlag", unsubscribeFlag);

            return await UpdateAsync(parameters, StoreProcedures.UnsubscribeClient);
        }

        public async Task<int> WaiveActivationToClientAsync(int user_id, int clientID, bool waiveFlag)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@ClientID", clientID);
            parameters.Add("@WaiveFlag", waiveFlag);

            return await UpdateAsync(parameters, StoreProcedures.WaiveActivationToClient);
        }
    }
}
