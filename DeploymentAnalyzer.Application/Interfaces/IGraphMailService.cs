using DeploymentAnalyzer.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface IGraphMailService
    {
        Task<bool> SendEmailAsync(string toAddress, string subject, string content, string fromAddress = "noreply@theratraq.com");
        Task<bool> SendOTPToClientEmailAsync(string emailAddress, string OTP);
        Task<bool> SendEmailAsync(EmailModel email);
    }
}
