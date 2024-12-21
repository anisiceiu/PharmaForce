using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface INewsManagementRepository : IGenericRepository<NewsManagementModel>
    {
        Task<IReadOnlyList<NewsManagementModel>> GetAllNewsAsync(BaseRequest request);
        Task<NewsManagementModel> GetNewsByIdAsync(long id);
        Task<int> AddNewsAsync(NewsManagementAddRequest entity);
        Task<int> UpdateNewsAsync(NewsManagementAddRequest entity);
        Task<int> DeleteNewsAsync(long id);
        Task<IReadOnlyList<NewsManagementModel>> GetNewsListAsync(NewsRequest request);
    }
}
