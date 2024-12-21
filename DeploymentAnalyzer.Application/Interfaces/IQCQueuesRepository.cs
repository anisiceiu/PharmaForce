using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IQCQueuesRepository
    {
        Task<QCQueueListResponse> GetQCQueuesAsync(QCQueueListRequest request);
        Task<int> AddQCQueuesAsync(QCQueuesRequest entity);
        Task<int> DeleteQCQueuesAsync(long Id, int userId);
        Task<int> ApproveQCQueue(ApproveQCQueuesRequest entity);
        Task<QCQueueListResponse> GetQCHistoriesAsync(QCQueueHistoryListRequest request);
    }
}
