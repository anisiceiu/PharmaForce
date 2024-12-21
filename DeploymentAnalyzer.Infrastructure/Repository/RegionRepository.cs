using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class RegionRepository : GenericRepository<RegionModel>, IRegionRepository
    {

        public RegionRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<RegionModel>> GetRegionListAsync(RegionListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.GetRegions);
            
        }

        public async Task<IReadOnlyList<RegionModel>> GetRegionListOnlyHasCountryAsync(RegionListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);

            return await GetAllAsync(parameters, StoreProcedures.GetRegionOnlyWithCountry);

        }
    }
}
