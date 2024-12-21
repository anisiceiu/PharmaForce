using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Logging;
using DeploymentAnalyzer.Server.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Data.SqlClient;

namespace DeploymentAnalyzer.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataManagerController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IGraphMailService _graphMailService;
        public DataManagerController(IUnitOfWork unitOfWork, IHubContext<NotificationHub> hubContext, IGraphMailService graphMailService)
        {
            _unitOfWork = unitOfWork;
            _hubContext = hubContext;
            _graphMailService = graphMailService;
        }

        /// <summary>
        /// Retrieves a list of all data manager items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DataManagerListResponse"/> objects.</returns>
        [HttpPost("GetDataManagerSalesforce")]
        public async Task<ApiResponse<DataManagerListResponse>> GetDataManagerSalesforce(DataManagerSalesforceRequest request)
        {
            var apiResponse = new ApiResponse<DataManagerListResponse>();

            try
            {
                var data = await _unitOfWork.DataManager.GetAllDataManagerAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }


        /// <summary>
        /// Retrieves a list of all data manager items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DataManagerListResponse"/> objects.</returns>
        [HttpPost("GetDataManagerSalesforceExcelData")]
        public async Task<ApiResponse<DataManagerListResponse>> GetDataManagerSalesforceExcelData(DataManagerSalesforceRequest request)
        {
            var apiResponse = new ApiResponse<DataManagerListResponse>();

            try
            {
                var data = await _unitOfWork.DataManager.GetAllDataManagerAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }
        /// <summary>
        /// Retrieves the details of a specific data manager item by its ID.
        /// </summary>
        /// <param name="Id">The unique identifier of the data manager item.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="DataManagerModel"/> for the specified ID.</returns>
        [HttpPost("GetDataManagerItemById")]
        public async Task<ApiResponse<List<DataManagerModel>>> GetDataManagerItemById(DataManagerByIdRequest request)
        {
            var apiResponse = new ApiResponse<List<DataManagerModel>>();
            try
            {
                var data = await _unitOfWork.DataManager.GetDataManagerByIdAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }


        /// <summary>
        /// Retrieves the details of a specific data manager item by its ID.
        /// </summary>
        /// <param name="Id">The unique identifier of the data manager item.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="DataManagerModel"/> for the specified ID.</returns>
        [HttpPost("GetSalesForceDataManagerItemById")]
        public async Task<ApiResponse<List<DataManagerModel>>> GetSalesForceDataManagerItemById(DataManagerBySalesForceIdRequest request)
        {
            var apiResponse = new ApiResponse<List<DataManagerModel>>();
            try
            {
                var data = await _unitOfWork.DataManager.GetSalesForceDataManagerByIdAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves the details of a specific data manager item by its ID from production.
        /// </summary>
        /// <param name="Id">The unique identifier of the data manager item.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="DataManagerModel"/> for the specified ID.</returns>
        [HttpPost("GetProductionDataManagerItemById")]
        public async Task<ApiResponse<List<DataManagerModel>>> GetProductionDataManagerItemById(DataManagerByIdRequest request)
        {
            var apiResponse = new ApiResponse<List<DataManagerModel>>();
            try
            {
                var data = await _unitOfWork.DataManager.GetProductionDataManagerByIdAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }


        /// <summary>
        /// Adds a new data manager item.
        /// </summary>
        /// <param name="request">The details of the data manager item to add.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPost("AddNewDataManagerItem")]
        public async Task<ApiResponse<int>> AddNewDataManagerItem(DataManagerAddRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DataManager.AddDataManagerAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Data manager item details added." : "Failed to add data manager item";
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Updates the details of an existing data manager item.
        /// </summary>
        /// <param name="dataManagerModel">The updated data manager item details.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("UpdateDataManagerItemInlineEdit")]
        public async Task<ApiResponse<int>> UpdateDataManagerItemInlineEdit(DataManagerModel dataManagerModel)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DataManager.UpdateDataManagerRecordInlineEditAsync(dataManagerModel);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Data manager item details updated." : "Failed to update data manager item";
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }


        /// <summary>
        /// Updates the details of an existing data manager item.
        /// </summary>
        /// <param name="dataManagerModel">The updated data manager item details.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("UpdateDataManagerItem")]
        public async Task<ApiResponse<int>> UpdateDataManagerItem(DataManagerUpdateRequest dataManagerModel)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DataManager.UpdateDataManagerAsync(dataManagerModel);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Data manager item details updated." : "Failed to update data manager item";
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }


        /// <summary>
        /// Deletes a data manager item by its ID.
        /// </summary>
        /// <param name="Id">The unique identifier of the data manager item to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpDelete("DeleteDataManagerItem/{Id}")]
        public async Task<ApiResponse<int>> DeleteDataManagerItem(string Id)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DataManager.DeleteDataManagerAsync(Id);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Data manager item deleted." : "Failed to delete data manager item";
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }




        /// <summary>
        /// Retrieves a list of all data manager filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DataManagerProductModel"/> objects.</returns>
        [HttpPost("GetDMSalesforceRecordsFilters")]
        public async Task<ApiResponse<DataManagerFilterSetResponse>> GetDMSalesforceRecordsFilters(DataManagerFilterListRequest request)
        {
            var apiResponse = new ApiResponse<DataManagerFilterSetResponse>();

            try
            {
                var data = await _unitOfWork.DataManager.GetDMSalesforceRecordsFiltersAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }


        /// <summary>
        /// publish the data manager items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DataManagerListResponse"/> objects.</returns>
        [HttpPost("PublishDataManagerItems")]
        public async Task<ApiResponse<int>> PublishDataManagerItems(PublishDataManager request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DataManager.PublishDataManagerAsync(request);
                apiResponse.Status = data > 0 ? true : false;
                apiResponse.Message = data > 0 ? "Data manager published." : "Failed to publish data manager items";
                apiResponse.Result = data;

                // Notify the client that the task is complete
                await _hubContext.Clients.All.SendAsync("TaskCompleted", apiResponse);
                //Notification Emails
                if (data > 0)
                {
                    var req = new BaseRequest() {
                     user_id = request.user_id,
                     client_id = request.client_id,
                    };

                    var emailList = await _unitOfWork.DataManager.SendNotificationEmailListAsync(req);
                    foreach (var email in emailList)
                    {
                       await _graphMailService.SendEmailAsync(email);;
                    }

                    //send email to Admin
                    var req_config = new GetEventEmailConfigRequest
                    {
                        user_id = request.user_id,
                        event_name = "DM Publish"
                    };

                    var event_email_config = await _unitOfWork.Admin.GetEventEmailConfigByEventNameAsync(req_config);
                    
                    if (event_email_config != null && !string.IsNullOrEmpty(event_email_config.event_subscribers))
                    {
                        var recipients = event_email_config.event_subscribers.Split(",");
                        var emailToAdmin = new EmailModel();
                        emailToAdmin.Subject = "DM Publish";
                        emailToAdmin.Body = "Data Manager has Published successfully.";

                        foreach(var email in recipients)
                        {
                            emailToAdmin.ToEmailAddress = email;
                            await _graphMailService.SendEmailAsync(emailToAdmin);
                        }

                    }
                }
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Deletes a DeleteDMSalesforceRecord .
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a success message.</returns>
        [HttpPut("DeleteDMSalesforceRecord")]
        public async Task<ApiResponse<int>> DeleteDMSalesforceRecord(DataManagerDeleteRequest request)
        {
            var apiResponse = new ApiResponse<int>();

            try
            {
                var data = await _unitOfWork.DataManager.DeleteDMSalesforceRecordAsync(request.User_id,request.DADatabase_Salesforce_Id);

                apiResponse.Status = true; 
                apiResponse.Message = true  ? "Salesforce Record deleted." : "Failed to delete the Salesforce Record.";
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves Get DM Companies For Country.
        /// </summary>
        /// <param name="Id">The unique identifier of the data manager item.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="CountryCompanyModel"/> for the specified ID.</returns>
        [HttpPost("GetDMCompaniesForCountry")]
        public async Task<ApiResponse<List<CountryCompanyModel>>> GetDMCompaniesForCountry(CascadingSelectRequest request)
        {
            var apiResponse = new ApiResponse<List<CountryCompanyModel>>();
            try
            {
                var data = await _unitOfWork.CountryCompany.GetDMCompaniesForCountry(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves Get DM Period & Salesforces For Company.
        /// </summary>
        /// <param name="Id">The unique identifier of the data manager item.</param>
        /// <returns>An <see cref="ApiResponse{T}"/> containing the <see cref="PeriodSalesforceModel"/> for the specified ID.</returns>
        [HttpPost("GetDMPeriodSalesforceForCompany")]
        public async Task<ApiResponse<List<PeriodSalesforceModel>>> GetDMPeriodSalesforceForCompany(CascadingSelectRequest request)
        {
            var apiResponse = new ApiResponse<List<PeriodSalesforceModel>>();
            try
            {
                var data = await _unitOfWork.PeriodSalesforce.GetDMPeriodSalesforceForCompany(request);
                apiResponse.Status = true;
                apiResponse.Result = data.ToList();
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of all salesforce items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DataManagerListResponse"/> objects.</returns>
        [HttpPost("GetCompensationSalesForceRecords")]
        public async Task<ApiResponse<DataManagerListResponse>> GetCompensationSalesForceRecords(CompensationListRequest request)
        {
            var apiResponse = new ApiResponse<DataManagerListResponse>();

            try
            {
                var data = await _unitOfWork.DataManager.GetCompensationSalesForceRecordsAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of all Compensation Records filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="IEnumerable<IdNamePair>"/> objects.</returns>
        [HttpPost("GetCompensationRecordsFilters")]
        public async Task<ApiResponse<IEnumerable<IdNamePair>>> GetCompensationRecordsFilters(CompensationFilterRequest request)
        {
            var apiResponse = new ApiResponse<IEnumerable<IdNamePair>>();

            try
            {
                var data = await _unitOfWork.DataManager.GetCompensationRecordsFiltersAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of all call planning items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="CallPlaningListResponse"/> objects.</returns>
        [HttpPost("GetCallPlanningRecords")]
        public async Task<ApiResponse<CallPlaningListResponse>> GetCallPlanningRecords(CallPlanningListRequest request)
        {
            var apiResponse = new ApiResponse<CallPlaningListResponse>();

            try
            {
                var data = await _unitOfWork.DataManager.GetCallPlanningRecordsAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of all Call planning Records filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="IEnumerable<IdNamePair>"/> objects.</returns>
        [HttpPost("GetCallPlanningFilters")]
        public async Task<ApiResponse<IEnumerable<IdNamePair>>> GetCallPlanningFilters(CallPlanningFilterRequest request)
        {
            var apiResponse = new ApiResponse<IEnumerable<IdNamePair>>();

            try
            {
                var data = await _unitOfWork.DataManager.GetCallPlanningFiltersAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }

        /// <summary>
        /// Retrieves a list of all data manager filter items.
        /// </summary>
        /// <returns>An <see cref="ApiResponse{T}"/> containing a list of <see cref="DataManagerProductModel"/> objects.</returns>
        [HttpPost("GetDataManagerRecordsFilters")]
        public async Task<ApiResponse<DataManagerFilterSetResponse>> GetDataManagerRecordsFilters(DataManagerFilterListRequest request)
        {
            var apiResponse = new ApiResponse<DataManagerFilterSetResponse>();

            try
            {
                var data = await _unitOfWork.DataManager.GetDataManagerRecordsFiltersAsync(request);
                apiResponse.Status = true;
                apiResponse.Result = data;
            }
            catch (SqlException ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("SQL Exception:", ex);
            }
            catch (Exception ex)
            {
                apiResponse.Status = false;
                apiResponse.Message = ex.Message;
                Logger.Instance.Error("Exception:", ex);
            }

            return apiResponse;
        }


    }
}
