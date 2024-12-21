using Azure.Identity;
using DeploymentAnalyzer.Application.Interfaces;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class GraphServiceClientFactory : IGraphServiceClientFactory
    {
        private readonly IGraphAuthProvider _authProvider;
        public GraphServiceClientFactory(IGraphAuthProvider authProvider)
        {
            _authProvider = authProvider;
        }

        public async Task<GraphServiceClient> GetAuthenticatedGraphClient()
        {
            //string refreshToken = "...";
            var refreshToken = await _authProvider.GetUserAccessTokenAsync();
            string[] scopes = new[] { "User.Read" };

            var onBehalfOfCredential = new OnBehalfOfCredential(
                tenantId: "your-tenant-id",
                clientId: "your-client-id",
                clientSecret: "your-client-secret",
                userAssertion: refreshToken
            );

            var graphClient = new GraphServiceClient(onBehalfOfCredential, scopes);

            return graphClient;
        }
        //public GraphServiceClient GetAuthenticatedGraphClient() =>
        //    new GraphServiceClient(new DelegateAuthenticationProvider(
        //        async requestMessage =>
        //        {
        //            var accessToken = await _authProvider.GetUserAccessTokenAsync();
        //            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        //            //var UserAccessToken = await _authProvider.GetUserDetailsTokenAsync();
        //            //requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", UserAccessToken);
        //        }));
    }
}
