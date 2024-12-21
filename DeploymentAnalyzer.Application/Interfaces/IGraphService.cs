using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IGraphService
    {
        
        Task<IEnumerable<AzureB2CUserDetails>> GetUserDetails(GraphServiceClient graphClient);
        Task<string> AddUserAzureDetails(GraphServiceClient graphClient, UserModel userModel);
        Task<string?> DeleteUserAzureDetails(GraphServiceClient graphClient, string emailAddress);
    }
}
