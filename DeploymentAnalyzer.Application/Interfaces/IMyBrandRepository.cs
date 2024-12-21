using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IMyBrandRepository : IGenericRepository<MyBrandModel>
    {
        Task<IReadOnlyList<MyBrandModel>> GetMyBrandGroupsAsync(BaseRequest request);
        Task<int> AddUpdateMyBrandAsync(AddUpdateMyBrandRequest request);
        Task<int> DeleteMyBrandAsync(long id);
        Task<IReadOnlyList<IdNamePair>> GetBrandGroupFiltersAsync(BrandGroupFilterRequest request);
        Task<CompanyTherapeuticBrandAssociationModel?> GetCompanyTherapeuticBrandAssociation(int myBrandId);
    }
}
