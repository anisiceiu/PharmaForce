using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    internal class GraphService : IGraphService
    {
        private readonly AzureAdB2CSettings _azureAdB2CSettings;

        public GraphService(
            IOptions<AzureAdB2CSettings> azureAdSettings)
        { 
            _azureAdB2CSettings = azureAdSettings.Value;
        }

        public async Task<IEnumerable<AzureB2CUserDetails>> GetUserDetails(GraphServiceClient graphClient)
        {

            try
            {

                //var result = await graphClient.Users
                //            .Request()
                //             .Select(e => new
                //             {
                //                 e.Id,
                //                 e.Mail,
                //                 e.GivenName,
                //                 e.Surname,
                //                 e.JobTitle,
                //                 e.MobilePhone,
                //                 e.StreetAddress,
                //                 e.City,
                //                 e.State,
                //                 e.PostalCode,
                //                 e.Country
                //             })
                //     .GetAsync();

                var result = await graphClient.Users.GetAsync((requestConfiguration) =>
                {
                    requestConfiguration.QueryParameters.Select = new string[] { "Mail", "Id","GivenName","Surname","JobTitle" };
                    //requestConfiguration.QueryParameters.Filter = "identities/any(c:c/issuerAssignedId eq 'j.smith@yahoo.com' and c/issuer eq 'My B2C tenant')";
                });


                //string[] usersDetails;
                List<AzureB2CUserDetails> usersDetails = new List<AzureB2CUserDetails>();
                foreach (var item in result.Value.ToList())
                {
                    AzureB2CUserDetails azureB2CUser = new AzureB2CUserDetails();
                    azureB2CUser.azure_guid = item.Id;
                    azureB2CUser.email = item.Mail;
                    azureB2CUser.user_name = item.Mail;
                    azureB2CUser.first_name = item.GivenName;
                    azureB2CUser.last_name = item.Surname;
                    azureB2CUser.jobTitle = item.JobTitle;
                    azureB2CUser.mobile_phone = item.MobilePhone;
                    azureB2CUser.StreetAddress = item.StreetAddress;
                    azureB2CUser.city = item.City;
                    azureB2CUser.state = item.State;
                    azureB2CUser.postCode = item.PostalCode;
                    azureB2CUser.country = item.Country;
                    usersDetails.Add(azureB2CUser);
                }

                var udetails = usersDetails.ToList();

                return udetails;

            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<string> AddUserAzureDetails(GraphServiceClient graphClient, UserModel userModel)
        {
            try
            {
                var user = new User
                {
                    AccountEnabled = true,
                    GivenName = userModel.Email,
                    
                    DisplayName = userModel.Email,
                    Mail = userModel.Email,
                   
                    Identities = new List<ObjectIdentity>
                    {
                         new ObjectIdentity()
                         {
                               SignInType = "emailAddress",
                               Issuer = _azureAdB2CSettings.Domain, //"deploymentanalyzerprodb2c.onmicrosoft.com",
                               IssuerAssignedId = userModel.Email
                         }
                    },
                    PasswordProfile = new PasswordProfile
                    {
                        ForceChangePasswordNextSignIn = false,
                        Password = userModel.Password
                    },
                };

                var result = await graphClient.Users
                    .PostAsync(user);

                return result.Id.ToString();

            }
            catch (Exception ex)
            {
                return string.Format("Error Occured :"+ex.Message);
            }
        }
        public async Task<string?> DeleteUserAzureDetails(GraphServiceClient graphClient,string emailAddress)
        {
            try
            {
                AzureB2CUserDetails? azureUser = null;
                var userList = await this.GetUserDetails(graphClient);
                if (userList != null)
                {
                    azureUser = userList.Where(u=> u.email == emailAddress).FirstOrDefault();
                    if (azureUser != null && !string.IsNullOrEmpty(azureUser.azure_guid))
                    {
                        await graphClient.Users[$"{azureUser.azure_guid}"]
                       .DeleteAsync();
                    }
                }
               

                return azureUser?.azure_guid;

            }
            catch (Exception ex)
            {
                return string.Format("Error Occured :" + ex.Message);
            }
        }
    }
}
