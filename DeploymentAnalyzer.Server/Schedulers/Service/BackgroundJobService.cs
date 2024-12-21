using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Server.Schedulers.Interface;

namespace DeploymentAnalyzer.Server.Schedulers.Service
{
    public class BackgroundJobService : IBackgroundJobService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IGraphMailService _graphMailService;
        public BackgroundJobService(IUnitOfWork unitOfWork, IGraphMailService graphMailService)
        {
            _unitOfWork = unitOfWork;
            _graphMailService = graphMailService;
        }
        public void AddRecord()
        {
            Task.Run(async () => {
                int result = await _unitOfWork.BackgroundJobRepository.AddNewJob();
                await SendEmail(result > 0);
            });
        }

        public async Task SendEmail(bool Status)
        {
            //send email to Admin
            var req_config = new GetEventEmailConfigRequest
            {
                user_id = 0,
                event_name = "Quarterly Rollout"
            };

            var event_email_config = await _unitOfWork.Admin.GetEventEmailConfigByEventNameAsync(req_config);

            if (event_email_config != null && !string.IsNullOrEmpty(event_email_config.event_subscribers))
            {
                var recipients = event_email_config.event_subscribers.Split(",");
                var emailToAdmin = new EmailModel();

                emailToAdmin.Subject = "DA2.0 Quarterly Rollout Completed";

                if (Status)
                    emailToAdmin.Body = "Data Manager has Published successfully.";
                else
                    emailToAdmin.Body = "Quarterly Rollout Failed.\r\n";

                foreach (var email in recipients)
                {
                    emailToAdmin.ToEmailAddress = email;
                    await _graphMailService.SendEmailAsync(emailToAdmin);
                }

            }
        }
    }
}
