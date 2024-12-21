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
    public class AdminLogRepository : GenericRepository<AdminLogModel>, IAdminLogRepository
    {
        public AdminLogRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<AdminLogModel>> GetAdminLogAsync(BaseRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@permission_granted", 0, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);

            return await GetAllAsync(parameters, StoreProcedures.GetAdminLog);
        }
    }
}
