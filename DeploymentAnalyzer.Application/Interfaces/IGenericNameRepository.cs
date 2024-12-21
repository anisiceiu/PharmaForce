using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IGenericNameRepository : IGenericRepository<GenericNameModel>
    {
        Task<IReadOnlyList<GenericNameModel>> GetGenericNameListAsync(GetGenericNameRequest request);
    }
}
