using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IUserClientRepository : IGenericRepository<UserClientModel>
    {
        Task<IReadOnlyList<UserClientModel>> GetUserClientsAsync(int userId);
        Task<string> AddUserClientAsync(UserClientAddRequest entity);
        Task<int> RemoveUserClientAsync(int clientId);
        Task<int> WaiveActivationToClientAsync(int user_id, int clientID,bool waiveFlag);
        Task<int> UnsubscribeClientAsync(int user_id, int clientID, bool unsubscribeFlag);
        Task<int> LockUnlockClientAccountAsync(int user_id,string clientEmailId, bool lockStatus,DateTime lockUnlockTime, bool isTemporaryLock = false);
        Task<int> ActiveDeactiveToClientAsync(int user_id, int clientID, bool activeFlag);
    }
}
