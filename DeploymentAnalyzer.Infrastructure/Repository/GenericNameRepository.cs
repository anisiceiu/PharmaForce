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
    public class GenericNameRepository : GenericRepository<GenericNameModel>, IGenericNameRepository
    {
        public GenericNameRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<GenericNameModel>> GetGenericNameListAsync(GetGenericNameRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@companyId", request.companyId);
            

            return await GetAllAsync(parameters, StoreProcedures.GetGenericNameList);
        }
    }
}
