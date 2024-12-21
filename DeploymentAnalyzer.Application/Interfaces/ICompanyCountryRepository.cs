using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface ICompanyCountryRepository
    {
        Task<IReadOnlyList<CompanyCountryModel>> GetAllCompanyCountryAsync(int user_id);
    }
}
