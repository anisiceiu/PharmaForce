using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IDataManagerProductRepository : IGenericRepository<DataManagerProductModel>
    {
        Task<IReadOnlyList<DataManagerProductModel>> GetAllDataManagerProductsAsync(DataManagerProductsRequest request);
        Task<int> DeleteDMProductRecordAsync( string DADatabase_Product_Id);
    }
}
