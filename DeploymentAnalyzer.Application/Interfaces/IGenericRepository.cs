using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IGenericRepository<T>
    {
        Task<IReadOnlyList<T>> GetAllAsync(object parameter, string storedProcedure);
        Task<T> GetByIdAsync(object parameter, string storedProcedure);
        Task<int> AddAsync(object entity, string storedProcedure);
        Task<int> UpdateAsync(object entity, string storedProcedure);
        Task<int> DeleteAsync(object parameter, string storedProcedure);
    }
}
