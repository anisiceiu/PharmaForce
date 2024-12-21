using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IAdminPermissionRepository
    {
        Task<int> AddAdminPermissionAsync(AdminPermissionAddRequest request);
        Task<int> UpdateAdminPermissionAsync(AdminPermissionModel request);
        Task<AdminPermissionModel> GetAdminPermissionByUserIdAsync(long id);
    }
}
