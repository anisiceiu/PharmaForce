using DeploymentAnalyzer.Server.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace DeploymentAnalyzer.Server.Filters
{
    public class AuthorizationFilterAttribute(IConfiguration configuration) : Attribute, IAuthorizationFilter
    {
        private readonly string _secret = configuration["JwtSettings:Secret"] ?? string.Empty;
        public void OnAuthorization(AuthorizationFilterContext context)
        {

            var endpoint = context.HttpContext.GetEndpoint();
            if (endpoint != null)
            {
                var allowAnonymous = endpoint.Metadata.GetMetadata<IAllowAnonymous>();
                if (allowAnonymous != null)
                {
                    return; // Bypass authorization
                }
            }

            var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            var authController = new AuthController();

            if (token == null)
            {
                context.Result = authController.NotAuthorized();
                return;
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secret);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
            }
            catch
            {
                context.Result = authController.NotAuthorized();
            }
        }
    }

}
