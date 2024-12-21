using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Utility.Common;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class GenericRepository<T> : IGenericRepository<T>
    {
        private readonly string _connectionString;

        public GenericRepository(IConfiguration configuration)
        {
            _connectionString = configuration?.GetConnectionString(Constants.DBConnection) ?? throw new ArgumentNullException(nameof(configuration), "Configuration or database connection string is null.");
        }

        private IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        private async Task<TResult> WithConnection<TResult>(Func<IDbConnection, Task<TResult>> getData)
        {
            try
            {
                using (IDbConnection connection = CreateConnection())
                {
                    connection.Open();
                    return await getData(connection);
                }
            }
            catch (Exception ex)
            {
                // Log exception (implementation of logging is omitted for brevity)
                throw new Exception("An error occurred while accessing the database.", ex);
            }
        }

        public async Task<IReadOnlyList<T>> GetAllAsync(object parameters, string storedProcedure)
        {
            return await WithConnection(async connection =>
            {
                var result = await connection.QueryAsync<T>(storedProcedure, parameters, commandType: CommandType.StoredProcedure, commandTimeout: 36000);
                return result.AsList();
            });
        }

        public async Task<T> GetByIdAsync(object parameters, string storedProcedure)
        {
            return await WithConnection(async connection =>
            {
                var entityDetails = await connection.QuerySingleOrDefaultAsync<T>(storedProcedure, parameters, commandType: CommandType.StoredProcedure, commandTimeout: 36000);

                if (entityDetails == null)
                {
                    entityDetails = Activator.CreateInstance<T>();
                }

                return entityDetails;
            });
        }

        public async Task<int> AddAsync(object entity, string storedProcedure)
        {
            return await WithConnection(async connection =>
            {
                var result = await connection.ExecuteAsync(storedProcedure, entity, commandType: CommandType.StoredProcedure, commandTimeout: 36000);
                return result;
            });
        }

        public async Task<int> UpdateAsync(object entity, string storedProcedure)
        {
            return await WithConnection(async connection =>
            {
                var result = await connection.ExecuteAsync(storedProcedure, entity, commandType: CommandType.StoredProcedure, commandTimeout: 3600);
                return result;
            });
        }

        public async Task<int> DeleteAsync(object parameters, string storedProcedure)
        {
            return await WithConnection(async connection =>
            {
                var result = await connection.ExecuteAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure, commandTimeout: 3600);
                return result;
            });
        }
    }
}
