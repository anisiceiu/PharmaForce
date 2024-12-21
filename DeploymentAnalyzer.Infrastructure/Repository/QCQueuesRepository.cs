using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class QCQueuesRepository : GenericRepository<QCQueuesModel>, IQCQueuesRepository
    {
        public QCQueuesRepository(IConfiguration configuration) : base(configuration)
        {
        }
        public async Task<int> AddQCQueuesAsync(QCQueuesRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DADatabase_Salesforce_id", request.DADatabase_Salesforce_id);
            parameters.Add("@column_name", request.column_name);
            parameters.Add("@DADatabase_Product_id", request.DADatabase_Product_id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@status", request.status);
            parameters.Add("@message", request.message);
            parameters.Add("@msg", request.msg);
            parameters.Add("@security_token", request.security_token);
            return await AddAsync(request, StoreProcedures.AddQCQueues);
        }

        public async Task<int> ApproveQCQueue(ApproveQCQueuesRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", request.id);
            parameters.Add("@type", request.type);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@status", request.status);
            parameters.Add("@caller", request.caller);
            parameters.Add("@message", request.message);
            parameters.Add("@security_token", request.security_token);
            return await AddAsync(request, StoreProcedures.ApproveQCQueue);
        }

        public async Task<int> DeleteQCQueuesAsync(long Id, int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", Id);
            parameters.Add("@user_id", userId);
            parameters.Add("@permission_granted", "");
            return await DeleteAsync(parameters, StoreProcedures.DeleteQCQueues);
        }

        public async Task<QCQueueListResponse> GetQCHistoriesAsync(QCQueueHistoryListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@pagesize", request.PageSize);
            parameters.Add("@page", request.Page);
            parameters.Add("@search_text", request.search_text);
            parameters.Add("@company", request.Company);
            parameters.Add("@country", request.Country);
            parameters.Add("@salesforce", request.Salesforce);
            parameters.Add("@product", request.Product);
            parameters.Add("@period_year", request.Period_Year);
            parameters.Add("@period_quarter", request.Period_Quarter);
            parameters.Add("@qcq_status", request.QCQ_Status);
            parameters.Add("@dadatabase_id", request.DADatabase_Id);
            parameters.Add("@has_citation", request.Has_Citation);
            parameters.Add("@sort_direction", request.SortDirection);
            parameters.Add("@sort_field", request.SortField);
            parameters.Add("@total_records", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("@is_pending", request.is_pending);
            parameters.Add("@is_reviewed", request.is_reviewed);
            parameters.Add("@is_approved", request.is_approved);
            parameters.Add("@is_rejected", request.is_rejected);
            parameters.Add("@DADatabase_Salesforce_id",request.DADatabase_Salesforce_id);
            parameters.Add("@permisison_granted", 0,DbType.Int32,ParameterDirection.Output);
            parameters.Add("@security_token", request.security_token);

            var result = await GetAllAsync(parameters, StoreProcedures.GetQCHistories);
            int totalRecords = parameters.Get<int>("@total_records");

            var response = new QCQueueListResponse()
            {
                Records = result,
                TotalRecords = totalRecords
            };

            return response;
        }

        public async Task<QCQueueListResponse> GetQCQueuesAsync(QCQueueListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@pagesize", request.PageSize);
            parameters.Add("@page", request.Page);
            parameters.Add("@search_text", request.search_text);
            parameters.Add("@company", request.Company);
            parameters.Add("@country", request.Country);
            parameters.Add("@salesforce", request.Salesforce);
            parameters.Add("@product", request.Product);
            parameters.Add("@period_year", request.Period_Year);
            parameters.Add("@period_quarter", request.Period_Quarter);
            parameters.Add("@qcq_status", request.QCQ_Status);
            parameters.Add("@dadatabase_id", request.DADatabase_Id);
            parameters.Add("@has_citation", request.Has_Citation);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@sort_direction", request.SortDirection);
            parameters.Add("@sort_field", request.SortField);
            parameters.Add("@total_records", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await GetAllAsync(parameters, StoreProcedures.GetQCQueues);
            int totalRecords = parameters.Get<int>("@total_records");

            var response = new QCQueueListResponse()
            {
                Records = result,
                TotalRecords = totalRecords
            };

            return response;
        }
    }
}
