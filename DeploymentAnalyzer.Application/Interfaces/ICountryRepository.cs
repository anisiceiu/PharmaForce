using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface ICountryRepository : IGenericRepository<CountryModel>
    {
        Task<IReadOnlyList<CountryModel>> GetAdminCountriesAsync(int user_id=0,string security_token="");
        Task<IReadOnlyList<CountryModel>> AdminGetCountriesAsync(AdminRequest request);

        Task<IReadOnlyList<CountryModel>> GetCountriesAsync(CountryForCompanyProfileModel request);
    }
}
