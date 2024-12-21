using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class GraphAuthProvider : IGraphAuthProvider
    {
        private readonly AzureAdSettings _azureAdSettings;
        private readonly AzureAdB2CSettings _azureAdB2CSettings;
        public GraphAuthProvider(IOptions<AzureAdSettings> azureAdSettings, IOptions<AzureAdB2CSettings> azureAdB2CSettings)
        {
            _azureAdSettings = azureAdSettings.Value;
            _azureAdB2CSettings = azureAdB2CSettings.Value;
        }
        public async Task<string> GetUserAccessTokenAsync()
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var content = new FormUrlEncodedContent(new[]
                    {
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_secret", _azureAdSettings.ClientSecret),
                new KeyValuePair<string, string>("client_id", _azureAdSettings.ClientId),
                new KeyValuePair<string, string>("scope", "https://graph.microsoft.com/.default")
                });

                    var result = await client.PostAsync(string.Format("https://login.microsoftonline.com/{0}/oauth2/v2.0/token", _azureAdSettings.TenantId), content);
                    string resultContent = await result.Content.ReadAsStringAsync();
                    var jsonResult = JObject.Parse(resultContent);
                    return jsonResult["access_token"].ToString();
                }
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }
    }
}
