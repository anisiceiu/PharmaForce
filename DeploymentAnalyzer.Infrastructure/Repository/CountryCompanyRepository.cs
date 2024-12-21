using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class CountryCompanyRepository : GenericRepository<CountryCompanyModel>, ICountryCompanyRepository
    {
        public CountryCompanyRepository(IConfiguration configuration) : base(configuration)
        {
        }
        public async Task<IReadOnlyList<CountryCompanyModel>> GetDMCompaniesForCountry(CascadingSelectRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@Country_Name", request.Country_Name);

            return await GetAllAsync(parameters, StoreProcedures.GetDMCompaniesForCountry);
        }
    }
}
