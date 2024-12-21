using Azure.Identity;
using DeploymentAnalyzer.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Graph.Users.Item.SendMail;
using DeploymentAnalyzer.Core.Entities;
using Microsoft.Extensions.Options;
using System.Net.Mail;


namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class GraphMailService : IGraphMailService
    {

        private readonly AzureEmailSettings _azureEmailSettings;
        IConfiguration _configuration;
        private readonly string SiteUrl= "";
        public GraphMailService(IOptions<AzureEmailSettings> azureEmailSettings, IConfiguration configuration)
        {
            _azureEmailSettings = azureEmailSettings.Value;
            _configuration = configuration;

            if (_configuration["SiteUrl"] != null)
            {
                SiteUrl = _configuration["SiteUrl"];
            }
        }
        public async Task<bool> SendEmailAsync(string toAddress, string subject, string content, string fromAddress = "noreply@theratraq.com")
        {
            //Working Values
            //string ClientId = "30f5f01c-b1c9-4102-8c1e-01d826681293";
            //string TenantId = "e60c0b83-52a7-4588-b32d-f19503e65258";
            //string ClientSecret = "dWg8Q~Cs5ChnGB0z_TmkW7NSUd.r85-HFJQxLcZa";


            ClientSecretCredential credential = new(_azureEmailSettings.TenantId, _azureEmailSettings.ClientId, _azureEmailSettings.ClientSecret);
            GraphServiceClient graphClient = new(credential);

            if (!string.IsNullOrEmpty(SiteUrl))
            {
                content = content + $"<br/><br/><a href=\"{SiteUrl}\" target=\"_blank\">{SiteUrl}</a>";
            }
            

            SendMailPostRequestBody requestBody = new SendMailPostRequestBody
            {
                Message = new Message
                {
                    Subject = subject,
                    Body = new ItemBody
                    {
                        ContentType = BodyType.Html,
                        Content = content,
                    },
                    ToRecipients = new List<Recipient>
                    {
                            new Recipient
                            {
                                EmailAddress = new EmailAddress
                                {
                                    Address = toAddress,
                                },
                            },
                    },
                    CcRecipients = new List<Recipient>
                    {
                    //new Recipient
                    //    {
                    //        EmailAddress = new EmailAddress
                    //        {
                    //            Address = "anisictiu@gmail.com",
                    //        },
                    //    },
                    },
                },
                SaveToSentItems = false,
            };

            try
            {
                await graphClient.Users[fromAddress].SendMail.PostAsync(requestBody);

                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
            

        }

        public async Task<bool> SendEmailAsync(EmailModel email)
        {
            try
            {
                string fromAddress = "noreply@theratraq.com";

                await this.SendEmailAsync(email.ToEmailAddress, email.Subject, email.Body, fromAddress);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> SendOTPToClientEmailAsync(string emailAddress, string OTP)
        {
            try
            {
                string subject = "Deployment Analyzer - OTP";

                string body = $"<p>Your OTP : <h3>{OTP}</h3> .This OTP Will be valid for 30 minutes.</p>";

                await this.SendEmailAsync(emailAddress,subject,body);

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
