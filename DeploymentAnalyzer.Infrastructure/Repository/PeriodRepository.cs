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
    public class PeriodRepository : GenericRepository<PeriodModel>, IPeriodRepository
    {
        public PeriodRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<PeriodModel>> GetAdminPeriodsAsync(int user_id = 0, string security_token = "")
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@security_token", security_token);
            parameters.Add("@permission_granted", 0, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);

            return await GetAllAsync(parameters, StoreProcedures.Admin_GetPeriod);
        }
    }
}
