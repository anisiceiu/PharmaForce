using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IUserEmailSuffixRepository : IGenericRepository<UserEmailSuffixModel>
    {
        Task<IReadOnlyList<UserEmailSuffixModel>> GetUserEmailSuffixAsync(int userId);
        Task<int> AddUserEmailSuffixAsync(UserEmailSuffixAddRequest entity);
        Task<int> DeleteUserEmailSuffixAsync(int id);
        Task<IReadOnlyList<UserRestrictedEmailSuffixModel>> GetUserRestrictedEmailSuffixAsync(int userId);
        Task<int> AddUserRestrictedEmailSuffixAsync(UserRestrictedEmailSuffixAddRequest entity);
        Task<int> DeleteUserRestrictedEmailSuffixAsync(int id);
    }
}
