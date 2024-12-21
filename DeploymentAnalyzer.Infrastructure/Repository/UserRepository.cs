using Dapper;
using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using static Dapper.SqlMapper;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class UserRepository : GenericRepository<UserModel>, IUserRepository
    {
        IConfiguration _configuration;
        public UserRepository(IConfiguration configuration) : base(configuration)
        {
            _configuration = configuration;
        }

        public async Task<UserAddUpdateResult> AddUserAsync(UserAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@name", request.Name);
            parameters.Add("@username", request.UserName);
            parameters.Add("@password", request.Password);
            parameters.Add("@enabled", request.Enabled);
            parameters.Add("@created", request.Created);
            parameters.Add("@expires", request.Expires);
            parameters.Add("@UserType", request.UserType);
            parameters.Add("@email", request.Email);
            parameters.Add("@logo", request.Logo);
            parameters.Add("@clientLimit", request.ClientLimit);
            parameters.Add("@description", request.Description);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@permission_granted", request.permission_granted,System.Data.DbType.Int32,System.Data.ParameterDirection.Output);
            parameters.Add("@message", "", System.Data.DbType.String, System.Data.ParameterDirection.Output);

            var result = await AddAsync(parameters, StoreProcedures.AddUser);

            string message = parameters.Get<string>("@message");

            return new UserAddUpdateResult { AffectedRows = result, Message = message };
        }

        public async Task<UserAddUpdateResult> UpdateUserAsync(UserModel request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@id", request.Id);
            parameters.Add("@name", request.Name);
            parameters.Add("@username", request.UserName);
            parameters.Add("@password", request.Password);
            parameters.Add("@enabled", request.Enabled);
            parameters.Add("@created", request.Created);
            parameters.Add("@expires", request.Expires);
            parameters.Add("@UserType", request.UserType);
            parameters.Add("@email", request.Email);
            parameters.Add("@logo", request.Logo);
            parameters.Add("@clientLimit", request.ClientLimit);
            parameters.Add("@description", request.Description);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@permission_granted", request.permission_granted, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);
            parameters.Add("@message", "", System.Data.DbType.String, System.Data.ParameterDirection.Output);

            var result = await UpdateAsync(parameters, StoreProcedures.UpdateUser);

            string message = parameters.Get<string>("@message");

            return new UserAddUpdateResult { AffectedRows=result, Message=message };
        }
        public async Task<int> UpdateUserExpiryAsync(UserExpiryModel request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.Id);
            parameters.Add("@ExpiryDate", request.Expires);
            return await UpdateAsync(parameters, StoreProcedures.UpdateUserExpiry);
        }

        public async Task<IReadOnlyList<UserModel>> GetAdminUserAsync()
        {
            var parameters = new DynamicParameters();

            return await GetAllAsync(parameters, StoreProcedures.GetAdminUsers);
        }

        public async Task<IReadOnlyList<UserModel>> GetQueryUserAsync()
        {
            var parameters = new DynamicParameters();

            return await GetAllAsync(parameters, StoreProcedures.GetQueryUsers);
        }
        public async Task<IReadOnlyList<UserModel>> GetUserExpiry()
        {
            var parameters = new DynamicParameters();

            return await GetAllAsync(parameters, StoreProcedures.GetUserExpiry);
        }

        public async Task<int> DisableAdminUsersAsync(UserChangeActionRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.Id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@permission_granted", request.permission_granted, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);
            parameters.Add("@EnableStaus", dbType: System.Data.DbType.Boolean, direction: System.Data.ParameterDirection.Output);

            await UpdateAsync(parameters, StoreProcedures.DisableAdminUsers);
            bool enableStatus = parameters.Get<bool>("@EnableStaus");
            return enableStatus ? 1 : 0;
        }

        public async Task<int> RemoveAdminUsersAsync(UserChangeActionRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.Id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@permission_granted", request.permission_granted, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);

            return await DeleteAsync(parameters, StoreProcedures.RemoveAdminUsers);
        }

        public async Task<IReadOnlyList<UserModel>> GetUsersAsync()
        {
            var parameters = new DynamicParameters();

            return await GetAllAsync(parameters, StoreProcedures.GetUser);
        }

        public async Task<IReadOnlyList<UserModel>> GetAllUsersAsync()
        {
            var parameters = new DynamicParameters();

            return await GetAllAsync(parameters, StoreProcedures.GetAllUser);
        }

        public async Task<UserVerifyLoginResult> VerifyAndGetUserAsync(LoginRequest request)
        {
            string message = "";
            var parameters = new DynamicParameters();
            parameters.Add("@IsAdmin", request.IsAdmin,System.Data.DbType.Boolean);
            parameters.Add("@UserName", request.UserName);
            parameters.Add("@Email", request.EmailAddress);
            parameters.Add("@Passowrd", request.Password);
            parameters.Add("@IPAddress", request.IPAddress);
            parameters.Add("@message", message, System.Data.DbType.String, System.Data.ParameterDirection.Output);


            var users = await GetAllAsync(parameters, StoreProcedures.VerifyUserForLogin);
            message = parameters.Get<string>("@message");

            var result = new UserVerifyLoginResult
            {
                Message = message,
                User = users.FirstOrDefault()
            };

            return await Task.FromResult(result);

            //var users = await GetAllAsync(parameters, StoreProcedures.VerifyUserForLogin);

            //return await Task.FromResult(users.FirstOrDefault());
        }

        public async Task<int> AddClientVerificationCode(int clientId,string emailAddress, string OTP)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ClientID", clientId);
            parameters.Add("@OTP", OTP);

            var data = await AddAsync(parameters, StoreProcedures.InsertClientReverificationCode);

            return 1; // SendOTPToClient(clientId,emailAddress,OTP);
        }

        public int SendOTPToClient(int clientId,string emailAddress, string OTP)
        {
            int result;
            try
            {
                LicenseMailSetting mailSetting = new LicenseMailSetting();
                mailSetting.SMTPEmailFrom = _configuration["LicenseMailSettings:SMTPEmailFrom"];
                mailSetting.GmailSMTPPort = Convert.ToInt32(_configuration["LicenseMailSettings:GmailSMTPPort"]);
                mailSetting.GmailSMTPSSL = Convert.ToBoolean(_configuration["LicenseMailSettings:GmailSMTPSSL"]);
                mailSetting.GmailSMTPServer = _configuration["LicenseMailSettings:GmailSMTPServer"];
                mailSetting.GmailSMTPPwd = _configuration["LicenseMailSettings:GmailSMTPPwd"];
                mailSetting.GmailSMTPUserName = _configuration["LicenseMailSettings:GmailSMTPUserName"];


                SmtpClient mySmtpClient = new SmtpClient(mailSetting.GmailSMTPServer);

                mySmtpClient.UseDefaultCredentials = false;
                mySmtpClient.EnableSsl = mailSetting.GmailSMTPSSL;
                mySmtpClient.Port = mailSetting.GmailSMTPPort;
                System.Net.NetworkCredential basicAuthenticationInfo = new
                System.Net.NetworkCredential(mailSetting.GmailSMTPUserName, mailSetting.GmailSMTPPwd);
                mySmtpClient.Credentials = basicAuthenticationInfo;

                MailAddress from = new MailAddress(mailSetting.SMTPEmailFrom?? "", "No Reply");
                MailAddress to = new MailAddress(emailAddress);
                MailMessage myMail = new System.Net.Mail.MailMessage(from, to);

                myMail.Subject = "Deployment Analyzer - OTP";
                myMail.SubjectEncoding = System.Text.Encoding.UTF8;

                myMail.Body = $"<p>Your OTP : {OTP} .This OTP Will be valid for 30 minutes.</p>";
                myMail.BodyEncoding = System.Text.Encoding.UTF8;
                myMail.IsBodyHtml = true;

                mySmtpClient.Send(myMail);

                result = 1;
            }
            catch
            {
                result = 0;
            }

            return result;

        }
        public async Task<UserModel?> ActivateClient(int clientId, string OTP)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ClientID", clientId);
            parameters.Add("@OTP", OTP);

            var user = await GetAllAsync(parameters, StoreProcedures.ActivateClient_New);

            return await Task.FromResult(user.FirstOrDefault());
        }

        public async Task<int> DeleteUserAsync(UserChangeActionRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.Id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@permission_granted", request.permission_granted, System.Data.DbType.Int32, System.Data.ParameterDirection.Output);

            return await DeleteAsync(parameters, StoreProcedures.DeleteUser);
        }

        public async Task<TryAddUserClientResult> TryAddNewUserClientAsync(LoginRequest request)
        {
            string message = "";
            var parameters = new DynamicParameters();
            parameters.Add("@UserName", request.UserName);
            parameters.Add("@EmailID", request.EmailAddress);
            parameters.Add("@Passowrd", request.Password);
            parameters.Add("@IPAddress", request.IPAddress);
            parameters.Add("@message", message,System.Data.DbType.String,System.Data.ParameterDirection.Output);


            var users = await GetAllAsync(parameters, StoreProcedures.AddNewUserClient);
            message = parameters.Get<string>("@message");

            var result = new TryAddUserClientResult {
             Message = message,
             User = users.FirstOrDefault()
            };

            return await Task.FromResult(result);
        }

        public async Task<UserModel?> GetAdminUserAsync(string userName, string email)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserName", userName);
            parameters.Add("@Email", email);

            var user = await GetByIdAsync(parameters, StoreProcedures.GetAdminUser);

            return user;
        }
    }
}
