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
    public class SalesforceRepository : GenericRepository<SalesforceModel>, ISalesforceRepository
    {
        public SalesforceRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<IReadOnlyList<SalesforceModel>> GetSalesforceListAsync(GetSalesforceRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@companyId", request.companyId);
            parameters.Add("@countryId", request.countryId);
            parameters.Add("@salesforceTypeId", request.salesforceTypeId);

            return await GetAllAsync(parameters, StoreProcedures.GetSalesforceList);
        }
    }
}
