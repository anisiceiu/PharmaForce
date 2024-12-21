using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IRegionRepository
    {
        Task<IReadOnlyList<RegionModel>> GetRegionListAsync(RegionListRequest request);
        Task<IReadOnlyList<RegionModel>> GetRegionListOnlyHasCountryAsync(RegionListRequest request);
    }
}
