using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class CountryRepository : GenericRepository<CountryModel>, ICountryRepository
    {
        public CountryRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<CountryModel>> GetAdminCountriesAsync(int user_id = 0, string security_token = "")
        {
            var parameters = new DynamicParameters();

            parameters.Add("@permission_granted", 0, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);
            parameters.Add("@user_id", user_id);
            parameters.Add("@security_token", security_token);

            return await GetAllAsync(parameters, StoreProcedures.Admin_GetCountries);
        }
        public async Task<IReadOnlyList<CountryModel>> AdminGetCountriesAsync(AdminRequest request)
        {
            var parameters = new DynamicParameters();
          
            parameters.Add("@permission_granted", 0, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.Admin_GetCountries);
        }

        public async Task<IReadOnlyList<CountryModel>> GetCountriesAsync(AdminRequest request)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@permission_granted", 0, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.Admin_GetCountries);
        }

        public async Task<IReadOnlyList<CountryModel>> GetCountriesAsync(CountryForCompanyProfileModel request)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@user_id", request.user_id);

            return await GetAllAsync(parameters, StoreProcedures.GetCountries);
        }
    }
}
