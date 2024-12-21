using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IUserPreferenceRepository : IGenericRepository<UserPreferenceModel>
    {
        Task<int> AddOrUpdateUserPreferencesAsync(UserPreferenceModel entity);
        Task<IReadOnlyList<UserPreferenceModel>> GetUserPreferencesAsync(int userId,int pageId);
        Task<int> AddOrUpdateUserAnalyticFiltersAsync(UserAnalyticFilterModel entity);
        Task<IReadOnlyList<UserAnalyticFilterModel>> GetUserAnalyticFiltersAsync(int userId,int client_id);
        Task<int> DeleteUserAnalyticFiltersAsync(long id);
    }
}
