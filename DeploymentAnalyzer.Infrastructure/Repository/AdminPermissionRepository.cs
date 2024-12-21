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
    public  class AdminPermissionRepository : GenericRepository<AdminPermissionModel> , IAdminPermissionRepository
    {
        public AdminPermissionRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<int> AddAdminPermissionAsync(AdminPermissionAddRequest request)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@UserID", request.UserID);
            parameters.Add("@Countries", request.Countries);
            parameters.Add("@Companies", request.Companies);
            parameters.Add("@AdminFunctions", request.AdminFunctions);
            parameters.Add("@LastUpdated", request.LastUpdated);

            return await AddAsync(parameters, StoreProcedures.AddAdminPermission);
        }

        public async Task<int> UpdateAdminPermissionAsync(AdminPermissionModel request)
        {
            var parameters = new DynamicParameters();

            parameters.Add("@AdminPermissionID", request.AdminPermissionID);
            parameters.Add("@UserID", request.UserID);
            parameters.Add("@Countries", request.Countries);
            parameters.Add("@Companies", request.Companies);
            parameters.Add("@AdminFunctions", request.AdminFunctions);
            parameters.Add("@LastUpdated", request.LastUpdated);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@permission_granted", request.permission_granted, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);

            return await UpdateAsync(parameters, StoreProcedures.UpdateAdminPermission);
        }

        public async Task<AdminPermissionModel> GetAdminPermissionByUserIdAsync(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", id);

            return await GetByIdAsync(parameters, StoreProcedures.GetAdminPermissionsByUserID);
        }
    }
}
