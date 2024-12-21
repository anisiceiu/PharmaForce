using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using static DeploymentAnalyzer.Application.Request.PublishDataManager;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IDataManagerRepository : IGenericRepository<DataManagerModel>
    {
        Task<DataManagerListResponse> GetAllDataManagerAsync(DataManagerSalesforceRequest request);
        Task<IReadOnlyList<DataManagerModel>> GetDataManagerByIdAsync(DataManagerByIdRequest request);

        Task<IReadOnlyList<DataManagerModel>> GetSalesForceDataManagerByIdAsync(DataManagerBySalesForceIdRequest request);
        Task<IReadOnlyList<DataManagerModel>> GetProductionDataManagerByIdAsync(DataManagerByIdRequest request);
        Task<int> AddDataManagerAsync(DataManagerAddRequest entity);
        Task<int> UpdateDataManagerAsync(DataManagerUpdateRequest entity);
        Task<int> DeleteDataManagerAsync(string id);
        Task<int> PublishDataManagerAsync(PublishDataManager publishDataManager);
        Task<DataManagerFilterSetResponse> GetDMSalesforceRecordsFiltersAsync(DataManagerFilterListRequest request);
        Task<int> DeleteDMSalesforceRecordAsync(int user_id,string DADatabase_Salesforce_Id);
        Task<DataManagerListResponse> GetCompensationSalesForceRecordsAsync(CompensationListRequest request);
        Task<IReadOnlyList<IdNamePair>> GetCompensationRecordsFiltersAsync(CompensationFilterRequest request);
        Task<CallPlaningListResponse> GetCallPlanningRecordsAsync(CallPlanningListRequest request);
        Task<IReadOnlyList<IdNamePair>> GetCallPlanningFiltersAsync(CallPlanningFilterRequest request);
        Task<DataManagerFilterSetResponse> GetDataManagerRecordsFiltersAsync(DataManagerFilterListRequest request);
        Task<int> UpdateDataManagerRecordInlineEditAsync(DataManagerModel request);
        Task<List<EmailModel>> SendNotificationEmailListAsync(BaseRequest request);
    }
}
