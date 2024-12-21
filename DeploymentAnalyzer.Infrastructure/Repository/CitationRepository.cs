using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models;
using Microsoft.IdentityModel.Tokens;
using System.Data.SqlClient;
using System.Data;
using static Dapper.SqlMapper;
using DeploymentAnalyzer.Utility.Common;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class CitationRepository : GenericRepository<CitationModel>, ICitationRespository
    {
        public IConfiguration _config { get; set; }
        public CitationRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }

        public async Task<int> AddUpdateCitationAsync(CitationRequest entity)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", entity.Id);
            parameters.Add("@user_id", entity.user_id);
            parameters.Add("@DADatabase_Salesforce_id", entity.DADatabase_Salesforce_Id);
            parameters.Add("@DADatabase_Product_id", entity.DADatabase_Product_Id);
            parameters.Add("@column_name", entity.ColumnName);
            parameters.Add("@date", entity.Date);
            parameters.Add("@url", entity.URL);
            parameters.Add("@description", entity.Description);
            parameters.Add("@type", entity.Type);
            parameters.Add("@source_function", entity.SourceFunction);
            parameters.Add("@source_type", entity.SourceType);
            parameters.Add("@company_overview", entity.CompanyOverview);
            parameters.Add("@interview_date", entity.InterviewDate);
            parameters.Add("@comments", entity.Comments);
            parameters.Add("@analyst_comments", entity.AnalystComments);
            parameters.Add("@status", entity.Status);
            parameters.Add("@security_token", entity.security_token);

            return await AddAsync(parameters, StoreProcedures.AddUpdateCitation);
        }


        public async Task<int> DeleteCitationAsync(DeleteCitationRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", request.Id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            return await DeleteAsync(parameters, StoreProcedures.DeleteCitation);
        }

        public async Task<IReadOnlyList<CitationModel>> GetCitationAsync(GetCitationRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@topn", request.Topn);
            parameters.Add("@DADatabase_Salesforce_id", request.DADatabase_Salesforce_Id);
            parameters.Add("@DADatabase_Product_id", request.DADatabase_Product_Id);
            parameters.Add("@column_list", request.Column_List);
            parameters.Add("@added_by", request.added_by);
            parameters.Add("@added_from", request.added_from);
            parameters.Add("@added_to", request.added_to);
            parameters.Add("@dadatabase_id", request.dadatabase_id);
            parameters.Add("@type", request.type);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@user_id", request.user_id);
            return await GetAllAsync(parameters, StoreProcedures.GetCitation);
        }

        public async Task<IReadOnlyList<CitationModel>> GetCitationManagerAsync(GetCitationManagerRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@user_id", request.user_id);
            return await GetAllAsync(parameters, StoreProcedures.GetCitationManager);
        }

        public async Task<IReadOnlyList<CitationModel>> GetCitationsForDMAsync(BaseRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller",request.caller);

            return await GetAllAsync(parameters, StoreProcedures.GetCitationsForDM);
        }

        public async Task<IReadOnlyList<CitationSmallModel>> GetCitationsByIdCSVAsync(GetCitationByIdCSVRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@id_list", request.id_list);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<CitationSmallModel>(StoreProcedures.GetCitationsByIdCSV, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }
    }
}
