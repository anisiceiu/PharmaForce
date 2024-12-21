using DeploymentAnalyzer.Application.Request;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IAccountRepository
    {
        Task<string> LoginUser(LoginRequest request);
        Task<string> GetJWTToken(LoginRequest request, string UserType);

        Task<string> RefreshToken();


    }
}
