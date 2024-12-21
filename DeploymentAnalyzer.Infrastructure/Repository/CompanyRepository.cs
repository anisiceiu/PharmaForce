using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class CompanyRepository : GenericRepository<CompanyModel>, ICompanyRepository
    {
        public CompanyRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<int> AddCompanyAsync(CompanyAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Company_Name", request.Company_Name);
            parameters.Add("@Company_Website_Global", request.Company_Website_Global);
            parameters.Add("@HeadQuarters", request.HeadQuarters);
            parameters.Add("@Number_of_Employees", request.Number_of_Employees);
            parameters.Add("@Type_of_Entity_Public_Private", request.Type_of_Entity_Public_Private);
            parameters.Add("@Sales_Previous_Year", request.Sales_Previous_Year);
            parameters.Add("@user_id", request.user_id);
            return await AddAsync(parameters, StoreProcedures.AddCompany);
        }

        public async Task<int> DeleteCompanyAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Company_Id", id);
            parameters.Add("@user_id", 0);
            return await DeleteAsync(parameters, StoreProcedures.DeleteCompany);
        }

        public async Task<IReadOnlyList<CompanyModel>> GetAdminCompaniesAsync(int user_id = 0, string security_token = "")
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@security_token", security_token);
            parameters.Add("@permission_granted", 0,System.Data.DbType.Int32,System.Data.ParameterDirection.Output);

            return await GetAllAsync(parameters, StoreProcedures.Admin_GetCompanies);
        }

        public async Task<IReadOnlyList<CompanyModel>> GetAllCompanyAsync()
        {
            var parameters = new DynamicParameters();
            
            return await GetAllAsync(parameters, StoreProcedures.GetAllCompany);
        }

        public async Task<CompanyModel> GetCompanyByIdAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Company_Id", id);

            return await GetByIdAsync(parameters, StoreProcedures.GetCompanyById);
        }

        public async Task<int> UpdateCompanyAsync(CompanyModel request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Company_Id", request.Company_Id);
            parameters.Add("@Company_Name", request.Company_Name);
            parameters.Add("@Company_Website_Global", request.Company_Website_Global);
            parameters.Add("@HeadQuarters", request.HeadQuarters);
            parameters.Add("@Number_of_Employees", request.Number_of_Employees);
            parameters.Add("@Type_of_Entity_Public_Private", request.Type_of_Entity_Public_Private);
            parameters.Add("@Sales_Previous_Year", request.Sales_Previous_Year);
            parameters.Add("@user_id", request.user_id);
            return await UpdateAsync(parameters, StoreProcedures.UpdateCompany);
        }

        public async Task<IReadOnlyList<CompanyModel>> AdminGetCompaniesAsync(AdminRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            return await GetAllAsync(parameters, StoreProcedures.Admin_GetCompanies);
        }
    }
}
