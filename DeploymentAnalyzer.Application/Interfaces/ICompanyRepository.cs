using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface ICompanyRepository : IGenericRepository<CompanyModel>
    {
        Task<IReadOnlyList<CompanyModel>> GetAllCompanyAsync();
        Task<CompanyModel> GetCompanyByIdAsync(long id);
        Task<int> AddCompanyAsync(CompanyAddRequest entity);
        Task<int> UpdateCompanyAsync(CompanyModel entity);
        Task<int> DeleteCompanyAsync(long id);
        Task<IReadOnlyList<CompanyModel>> GetAdminCompaniesAsync(int user_id = 0, string security_token = "");
        Task<IReadOnlyList<CompanyModel>> AdminGetCompaniesAsync(AdminRequest request);
    }
}
