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
    public class DepUserRepository : GenericRepository<DepUserModel>, IDepUserRepository
    {
        public DepUserRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<DepUserModel>> GetAllDepUserAsync()
        {
            var parameters = new DynamicParameters();

            return await GetAllAsync(parameters, StoreProcedures.GetUnlockedUser);
        }

        public async Task<int> UnlockUserAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", id);

            return await UpdateAsync(parameters, StoreProcedures.UnlockUser);
        }
    }
}
