

using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class BackgroundJobRepository : GenericRepository<AdminFunctionModel>, IBackgroundJobRepository
    {
        public BackgroundJobRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<int> AddNewJob()
        {
            var parameters = new DynamicParameters();
            return await AddAsync(parameters, StoreProcedures.RunJobForQuaterly);
        }

    }
}
