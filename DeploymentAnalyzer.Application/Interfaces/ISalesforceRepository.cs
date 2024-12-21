using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface ISalesforceRepository : IGenericRepository<SalesforceModel>
    {
        Task<IReadOnlyList<SalesforceModel>> GetSalesforceListAsync(GetSalesforceRequest request);
    }
}
