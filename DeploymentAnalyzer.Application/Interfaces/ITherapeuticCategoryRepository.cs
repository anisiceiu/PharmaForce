using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface ITherapeuticCategoryRepository : IGenericRepository<TherapeuticCategoryModel>
    {
        Task<IReadOnlyList<TherapeuticCategoryModel>> GetAdminTherapeuticCategoriesAsync(int user_id = 0, string security_token = "");
    }
   
}
