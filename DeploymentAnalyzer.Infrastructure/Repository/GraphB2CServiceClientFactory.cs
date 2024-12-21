using Azure.Identity;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Kiota.Abstractions.Authentication;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Text;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class GraphB2CServiceClientFactory : IGraphB2CServiceClientFactory
    {
        private readonly IGraphB2CAuthProvider _authProvider;
        private readonly AzureAdB2CSettings _azureAdB2CSettings;
        public GraphB2CServiceClientFactory(IGraphB2CAuthProvider authProvider,
            IOptions<AzureAdB2CSettings> azureAdB2CSettings)
        {
            _authProvider = authProvider;
            _azureAdB2CSettings = azureAdB2CSettings.Value;
        }
        public GraphServiceClient GetB2CAuthenticatedGraphClient()
        {
            //string refreshToken = "...";
            
            try
            {
                var scopes = new[] { ".default" };

                // Multi-tenant apps can use "common",
                // single-tenant apps must use the tenant ID from the Azure portal
                var tenantId = _azureAdB2CSettings.TenantId;

                // Value from app registration
                var clientId = _azureAdB2CSettings.ClientId;
                var clientsecret = _azureAdB2CSettings.ClientSecret;


                var clientSecretCredential = new ClientSecretCredential(
                tenantId, clientId, clientsecret);

                var graphClient = new GraphServiceClient(clientSecretCredential, scopes);

                return graphClient;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }

        }
    }
}
