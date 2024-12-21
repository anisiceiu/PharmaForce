using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Utility.Common;
using DeploymentAnalyzer.Utility.Extensions;


namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly JwtSettings _jwtSettings;
        public AccountRepository(JwtSettings jwtSettings)
        {
            _jwtSettings = jwtSettings;
        }

        public async Task<string> GetJWTToken(LoginRequest request,string UserType)
        {
            string? token = TokenService.GenerateToken(_jwtSettings, request);

            return await Task.FromResult(token);
        }

        public Task<string> LoginUser(LoginRequest request)
        {
            var token = "0";
            if (request.EmailAddress == "jnagy" && request.Password == "MyTest@123")
            {
                token = TokenService.GenerateToken(_jwtSettings, request);
            }
            return Task.FromResult(token);
        }

        public Task<string> RefreshToken()
        {
            var token = TokenService.GenerateRefreshToken(_jwtSettings);
            return Task.FromResult(token);
        }
    }
}
