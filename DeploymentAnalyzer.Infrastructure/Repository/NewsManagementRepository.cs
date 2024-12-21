using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class NewsManagementRepository : GenericRepository<NewsManagementModel>, INewsManagementRepository
    {

        public NewsManagementRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<int> AddNewsAsync(NewsManagementAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Short_Message", request.Short_Message);
            parameters.Add("@Long_Message", request.Long_Message);
            parameters.Add("@News_Url", request.News_Url);
            parameters.Add("@News_Date", request.News_Date);
            parameters.Add("@Country_Id", request.Country_Id);
            parameters.Add("@Company_Id", request.Company_Id);
            parameters.Add("@user_id", request.user_id);
            return await AddAsync(parameters, StoreProcedures.AddNews);
        }

        public async Task<int> DeleteNewsAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@News_Id", id);
            return await DeleteAsync(parameters, StoreProcedures.DeleteNews);
        }

        public async Task<IReadOnlyList<NewsManagementModel>> GetAllNewsAsync(BaseRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id",request.user_id);
            return await GetAllAsync(parameters, StoreProcedures.GetAllNews);
        }

        public async Task<NewsManagementModel> GetNewsByIdAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@NewsId", id);
            return await GetByIdAsync(parameters, StoreProcedures.GetNewsById);
        }

        public async Task<IReadOnlyList<NewsManagementModel>> GetNewsListAsync(NewsRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@news_date_start", request.news_date_start);
            parameters.Add("@news_date_end", request.news_date_end);
            parameters.Add("@country_id", request.country_id);
            parameters.Add("@company_id", request.company_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.GetNewsList);
        }

        public async Task<int> UpdateNewsAsync(NewsManagementAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@News_Id", request.News_id);
            parameters.Add("@Short_Message", request.Short_Message);
            parameters.Add("@Long_Message", request.Long_Message);
            parameters.Add("@News_Url", request.News_Url);
            parameters.Add("@News_Date", request.News_Date);
            parameters.Add("@Country_Id", request.Country_Id);
            parameters.Add("@Company_Id", request.Company_Id);
            parameters.Add("@user_id", request.user_id);
            return await UpdateAsync(parameters, StoreProcedures.UpdateNews);
        }
    }
}
