using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IMasterCodeRepository
    {
        Task<IReadOnlyList<MasterCodeModel>> GetMasterCodeByCategory(MasterCodeModel request);
        Task<IReadOnlyList<string>> GetMasterCodeAllCategories();
        Task<IReadOnlyList<MasterCodeModel>> GetMasterCodeAsync();
        Task<MasterCodeAddUpdateResult> AddUpdateMastercodeAsync(MasterCodeRequest entity);
        Task<int> DeleteMasterCodeAsync(long id, int userId);
        Task<MasterCodeModel> GetAdminCurrentPeriodAsync(int user_id = 0, string security_token = "");
        Task<IReadOnlyList<IdNamePair>> GetMasterCodeAddFilters(int type);
        Task<IReadOnlyList<IdNamePair>> GetMasterCodeFiltersAsync(MasterCodeFilterRequest request);
        Task<IReadOnlyList<MasterCodeModel>> GetMasterCodeRecordsAsync(MasterCodeListRequest request);
        Task<IReadOnlyList<USNameOptions>> GetMasterCodeUSNameFilters(MasterCodeFilterRequest request);
    }
}
