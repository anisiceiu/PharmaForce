using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
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
    public class CompanyCountryRepository : GenericRepository<CompanyCountryModel>, ICompanyCountryRepository
    {
        public CompanyCountryRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<CompanyCountryModel>> GetAllCompanyCountryAsync(int user_id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            return await GetAllAsync(parameters, StoreProcedures.GetAllCompanyCountry);
        }
    }
}
