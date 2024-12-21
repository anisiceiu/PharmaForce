using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IAdminRepository
    {
        Task<IReadOnlyList<AdminFunctionModel>> AdminGetFunctionsAsync(AdminRequest request);
        Task<int> UpdateEventEmailConfig(EventEmailConfigModel eventEmailConfig);
        Task<IReadOnlyList<EventEmailConfigModel>> GetEventEmailConfigsAsync(BaseRequest request);
        Task<EventEmailConfigModel?> GetEventEmailConfigByEventNameAsync(GetEventEmailConfigRequest request);
    }
}
