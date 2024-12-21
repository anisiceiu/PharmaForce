using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IPeriodRepository : IGenericRepository<PeriodModel>
    {
        Task<IReadOnlyList<PeriodModel>> GetAdminPeriodsAsync(int user_id = 0, string security_token = "");
    }
}
