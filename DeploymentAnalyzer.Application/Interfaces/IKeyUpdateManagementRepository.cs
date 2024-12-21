using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IKeyUpdateManagementRepository
    {
        Task<IReadOnlyList<KeyUpdateManagementModel>> GetKeyUpdatesAsync(int user_id);
        Task<int> AddUpdateKeyAsync(UpdateManagementAddRequest request);
        Task<int> DeleteKeyUpdateAsync(long id);
        Task<IReadOnlyList<KeyUpdateTagModel>> GetKeyUpdateTagsAsync(int user_id);
        Task<IReadOnlyList<KeyUpdateManagementModel>> GetKeyUpdateListAsync(KeyUpdateRequest request);
    }
}
