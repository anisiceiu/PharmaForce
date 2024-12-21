using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class NotesRepository : GenericRepository<NotesModel>, INotesRespository
    {
        public NotesRepository(IConfiguration configuration) : base(configuration)
        {
        }
        public async Task<int> AddUpdateNotesAsync(NotesRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", request.Id);
            parameters.Add("@DADatabase_Salesforce_id", request.DADatabase_Salesforce_Id);
            parameters.Add("@DADatabase_Product_id", request.DADatabase_Product_Id);
            parameters.Add("@column_name", request.Column_Name);
            parameters.Add("@notes_for", request.Note_For);
            parameters.Add("@type", request.Type);
            parameters.Add("@description", request.Description);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@status", request.Status, DbType.Int32, ParameterDirection.Output);
            parameters.Add("@msg", request.Msg,DbType.String,ParameterDirection.Output);
            parameters.Add("@security_token", request.security_token);

            return await AddAsync(parameters, StoreProcedures.AddUpdateNotes);
        }

        public async Task<int> DeleteNotesAsync(long id, int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", id);
            parameters.Add("@user_id", userId);
            return await DeleteAsync(parameters, StoreProcedures.DeleteNotes);
        }

        public async Task<IReadOnlyList<NotesModel>> GetNotesAsync(NoteListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            //parameters.Add("@pagesize", request.PageSize);
            //parameters.Add("@page", request.Page);
            parameters.Add("@search_text", request.search_text);
            parameters.Add("@company", request.Company);
            parameters.Add("@country", request.Country);
            parameters.Add("@salesforce", request.Salesforce);
            //parameters.Add("@product", request.Product);
            parameters.Add("@period_year", request.Period_Year);
            parameters.Add("@period_quarter", request.Period_Quarter);
            //parameters.Add("@qcq_status", request.QCQ_Status);
            //parameters.Add("@has_citation", request.Has_Citation);
            parameters.Add("@dadatabase_id", request.DADatabase_Id);
            parameters.Add("@DADatabase_Salesforce_id", request.DADatabase_Salesforce_Id);
            parameters.Add("@DADatabase_Product_id", request.DADatabase_Product_id);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.GetNotes);
        }
    }
}
