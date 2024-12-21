using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IPeriodSalesforceRepository : IGenericRepository<PeriodSalesforceModel>
    {
        Task<IReadOnlyList<PeriodSalesforceModel>> GetDMPeriodSalesforceForCompany(CascadingSelectRequest request);
    }
}
