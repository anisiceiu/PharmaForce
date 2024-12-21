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
    public class UserLoginDetailRepository : GenericRepository<UserLoginDetail>, IUserLoginDetailRepository
    {
        public UserLoginDetailRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<UserLoginDetail>> GetUserLoginDetail()
        {
            var parameters = new DynamicParameters();

            return await GetAllAsync(parameters, StoreProcedures.GetUserLoginDetail);
        }

       
    }
}
