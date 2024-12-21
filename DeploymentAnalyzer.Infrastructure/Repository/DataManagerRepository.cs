using Dapper;
using DeploymentAnalyzer.Application.Common;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Application.Response;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Common;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models;
using System.Data;
using System.Data.SqlClient;
using static System.Net.WebRequestMethods;
using System.Net.Mail;

namespace DeploymentAnalyzer.Infrastructure.Repository
{

    public class DataManagerRepository : GenericRepository<DataManagerModel>, IDataManagerRepository
    {
        public IConfiguration _config { get; set; }
        public DataManagerRepository(IConfiguration configuration) : base(configuration)
        {
            _config = configuration;
        }
        public async Task<DataManagerListResponse> GetAllDataManagerAsync(DataManagerSalesforceRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@pagesize", request.PageSize);
            parameters.Add("@page", request.Page);
            parameters.Add("@company", request.Company);
            parameters.Add("@country", request.Country);
            parameters.Add("@salesforce", request.Salesforce);
            parameters.Add("@search_text", request.search_text);
            parameters.Add("@product", request.Product);
            parameters.Add("@period_year", request.Period_Year);
            parameters.Add("@period_quarter", request.Period_Quarter);
            parameters.Add("@qcq_status", request.QCQ_Status);
            parameters.Add("@dadatabase_id", request.DADatabase_Id);
            parameters.Add("@has_citation", request.Has_Citation);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@sort_direction", request.SortDirection);
            parameters.Add("@sort_field", request.SortField);
            parameters.Add("@total_records", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await GetAllAsync(parameters, StoreProcedures.GetDMSalesforceRecords);
            int totalRecords = parameters.Get<int>("@total_records");

            var response = new DataManagerListResponse()
            {
                Records = result,
                TotalRecords = totalRecords
            };
            return response;
        }
        public async Task<IReadOnlyList<DataManagerModel>> GetDataManagerByIdAsync(DataManagerByIdRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DADatabase_Product_Id", request.DADatabase_Product_Id);
            parameters.Add("@DADatabase_Salesforce_Id", request.DADatabase_Salesforce_Id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);


            return await GetAllAsync(parameters, StoreProcedures.GetDataManagerById);
        }

        public async Task<IReadOnlyList<DataManagerModel>> GetSalesForceDataManagerByIdAsync(DataManagerBySalesForceIdRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DADatabase_SalesForce_Id", request.DADatabase_SalesForce_Id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);


            return await GetAllAsync(parameters, StoreProcedures.GetSalesForceDataManagerItemById);
        }

        public async Task<IReadOnlyList<DataManagerModel>> GetProductionDataManagerByIdAsync(DataManagerByIdRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DADatabase_Product_Id", request.DADatabase_Product_Id);
            parameters.Add("@DADatabase_Salesforce_Id", request.DADatabase_Salesforce_Id);
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);


            return await GetAllAsync(parameters, StoreProcedures.GetProductionDataManagerById);
        }

        public async Task<int> AddDataManagerAsync(DataManagerAddRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("Country_Name", request.Country_Name);
            parameters.Add("Company_Name", request.Company_Name);
            parameters.Add("Period_Year", request.Period_Year);
            parameters.Add("Period_Quarter", request.Period_Quarter);
            parameters.Add("Salesforce_Name", request.Salesforce_Name);
            parameters.Add("Type_of_Salesforce", request.Type_of_Salesforce);
            parameters.Add("Number_Of_Sales_Representatives", request.Number_Of_Sales_Representatives);
            parameters.Add("Number_Of_District_Managers", request.Number_Of_District_Managers);
            parameters.Add("Number_Of_Regional_Managers", request.Number_Of_Regional_Managers);
            parameters.Add("Salary_Low", request.Salary_Low);
            parameters.Add("Salary_High", request.Salary_High);
            parameters.Add("Target_Bonus", request.Target_Bonus);
            parameters.Add("Reach", request.Reach);
            parameters.Add("Frequency", request.Frequency);
            parameters.Add("Additional_Notes_Salesforce", request.Additional_Notes_Salesforce);
            parameters.Add("Pct_Split_Between_Primary_Care_And_Specialty", request.Pct_Split_Between_Primary_Care_And_Specialty);
            parameters.Add("@DADatabase_Salesforce_Id", request.DADatabase_SalesForce_Id);
            parameters.Add("@AddToQCQ", request.IsAddToQCQ ? 1 : 0);

            parameters.Add("@Country_Name_qcq", request.Country_Name_qcq);
            parameters.Add("@Company_Name_qcq", request.Company_Name_qcq);
            parameters.Add("@Period_Year_qcq", request.Period_Year_qcq);
            parameters.Add("@Period_Quarter_qcq", request.Period_Quarter_qcq);
            parameters.Add("@Salesforce_Name_qcq", request.Salesforce_Name_qcq);
            parameters.Add("@Type_of_Salesforce_qcq", request.Type_of_Salesforce_qcq);
            parameters.Add("@Number_Of_Sales_Representatives_qcq", request.Number_Of_Sales_Representatives_qcq);
            parameters.Add("@Number_Of_District_Managers_qcq", request.Number_Of_District_Managers_qcq);
            parameters.Add("@Number_Of_Regional_Managers_qcq", request.Number_Of_Regional_Managers_qcq);
            parameters.Add("@Salary_Low_qcq", request.Salary_Low_qcq);
            parameters.Add("@Salary_High_qcq", request.Salary_High_qcq);
            parameters.Add("@Target_Bonus_qcq", request.Target_Bonus_qcq);
            parameters.Add("@Reach_qcq", request.Reach_qcq);
            parameters.Add("@Frequency_qcq", request.Frequency_qcq);

            var productTable = new DataTable();
            productTable.Columns.Add("DADatabase_Product_Id", typeof(string));
            productTable.Columns.Add("DADatabase_Salesforce_Id", typeof(string));
            productTable.Columns.Add("US_Product_Name_Product_Promoted", typeof(string));
            productTable.Columns.Add("Country_Specific_Product_Name_Product_Promoted", typeof(string));
            productTable.Columns.Add("Generic_Name", typeof(string));
            productTable.Columns.Add("Therapeutic_Category", typeof(string));
            productTable.Columns.Add("Product_Promotion_Priority_Order", typeof(int));
            productTable.Columns.Add("Total_Number_of_Full_Time_Equivalents_FTEs", typeof(float));
            productTable.Columns.Add("Primary_Care_Full_Time_Equivalents_FTEs", typeof(float));
            productTable.Columns.Add("Specialty_Full_Time_Equivalents_FTEs", typeof(float));
            productTable.Columns.Add("Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians", typeof(string));
            productTable.Columns.Add("Specialty_Physicians_Targeted", typeof(string));
            productTable.Columns.Add("Co_Promotion_YesNo", typeof(bool));
            productTable.Columns.Add("Name_of_a_Partner_Company", typeof(string));
            productTable.Columns.Add("Contract_Sales_Force_YesNo", typeof(bool));
            productTable.Columns.Add("Name_of_a_CSO_Contract_Sales_Organization", typeof(string));
            productTable.Columns.Add("Additional_Notes_Product", typeof(string));


            productTable.Columns.Add("US_Product_Name_Product_Promoted_qcq", typeof(string));
            productTable.Columns.Add("Country_Specific_Product_Name_Product_Promoted_qcq", typeof(string));
            productTable.Columns.Add("Generic_Name_qcq", typeof(string));
            productTable.Columns.Add("Therapeutic_Category_qcq", typeof(string));
            productTable.Columns.Add("Product_Promotion_Priority_Order_qcq", typeof(string));
            productTable.Columns.Add("Total_Number_of_Full_Time_Equivalents_FTEs_qcq", typeof(string));
            productTable.Columns.Add("Primary_Care_Full_Time_Equivalents_FTEs_qcq", typeof(string));
            productTable.Columns.Add("Specialty_Full_Time_Equivalents_FTEs_qcq", typeof(string));
            productTable.Columns.Add("Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq", typeof(string));
            productTable.Columns.Add("Specialty_Physicians_Targeted_qcq", typeof(string));
            productTable.Columns.Add("Co_Promotion_YesNo_qcq", typeof(string));
            productTable.Columns.Add("Name_of_a_Partner_Company_qcq", typeof(string));
            productTable.Columns.Add("Contract_Sales_Force_YesNo_qcq", typeof(string));
            productTable.Columns.Add("Name_of_a_CSO_Contract_Sales_Organization_qcq", typeof(string));


            if (request.ProductItems != null && request.ProductItems.Count > 0)
            {
                foreach (var product in request.ProductItems)
                {
                    product.Total_Number_of_Full_Time_Equivalents_FTEs
                          = (float)Convert.ToDouble(product.Primary_Care_Full_Time_Equivalents_FTEs)
                           + (float)Convert.ToDouble(product.Specialty_Full_Time_Equivalents_FTEs);
                }
            }

            foreach (var product in request.ProductItems)
            {
                productTable.Rows.Add(
                    product.DADatabase_Product_Id,
                    product.DADatabase_Salesforce_Id,
                    product.US_Product_Name_Product_Promoted,
                    product.Country_Specific_Product_Name_Product_Promoted,
                    product.Generic_Name,
                    product.Therapeutic_Category,
                    product.Product_Promotion_Priority_Order,
                    product.Total_Number_of_Full_Time_Equivalents_FTEs,
                    product.Primary_Care_Full_Time_Equivalents_FTEs,
                    product.Specialty_Full_Time_Equivalents_FTEs,
                    product.Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians,
                    product.Specialty_Physicians_Targeted,
                    product.Co_Promotion_YesNo,
                    product.Name_of_a_Partner_Company,
                    product.Contract_Sales_Force_YesNo,
                    product.Name_of_a_CSO_Contract_Sales_Organization,
                    product.Additional_Notes_Product,
                    product.US_Product_Name_Product_Promoted_qcq,
                    product.Country_Specific_Product_Name_Product_Promoted_qcq,
                    product.Generic_Name_qcq,
                    product.Contract_Sales_Force_YesNo_qcq,
                    product.Therapeutic_Category_qcq,
                    product.Product_Promotion_Priority_Order_qcq,
                    product.Total_Number_of_Full_Time_Equivalents_FTEs_qcq,
                    product.Primary_Care_Full_Time_Equivalents_FTEs_qcq,
                    product.Specialty_Full_Time_Equivalents_FTEs_qcq,
                    product.Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq,
                    product.Specialty_Physicians_Targeted_qcq,
                    product.Co_Promotion_YesNo_qcq,
                    product.Name_of_a_Partner_Company_qcq,
                    product.Name_of_a_CSO_Contract_Sales_Organization_qcq
                );
            }


            parameters.Add("@Products", productTable.AsTableValuedParameter("dbo.DADatabase_Product_Type"));

            return await AddAsync(parameters, StoreProcedures.AddDataManager);
        }

        public async Task<int> UpdateDataManagerAsync(DataManagerUpdateRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@DADatabase_Salesforce_Id", request.DADatabase_Salesforce_Id);
            parameters.Add("Country_Name", request.Country_Name);
            parameters.Add("Company_Name", request.Company_Name);
            parameters.Add("Period_Year", request.Period_Year);
            parameters.Add("Period_Quarter", request.Period_Quarter);
            parameters.Add("Salesforce_Name", request.Salesforce_Name);
            parameters.Add("Type_of_Salesforce", request.Type_of_Salesforce);
            parameters.Add("Number_Of_Sales_Representatives", request.Number_Of_Sales_Representatives);
            parameters.Add("Number_Of_District_Managers", request.Number_Of_District_Managers);
            parameters.Add("Number_Of_Regional_Managers", request.Number_Of_Regional_Managers);
            parameters.Add("Salary_Low", request.Salary_Low);
            parameters.Add("Salary_High", request.Salary_High);
            parameters.Add("Target_Bonus", request.Target_Bonus);
            parameters.Add("Reach", request.Reach);
            parameters.Add("Frequency", request.Frequency);
            parameters.Add("Additional_Notes_Salesforce", request.Additional_Notes_Salesforce);
            parameters.Add("Pct_Split_Between_Primary_Care_And_Specialty", request.Pct_Split_Between_Primary_Care_And_Specialty);
            parameters.Add("@AddToQCQ", request.IsAddToQCQ ? 1 : 0);
            parameters.Add("@periodList", request.periodList);

            parameters.Add("@Country_Name_qcq", request.Country_Name_qcq);
            parameters.Add("@Company_Name_qcq", request.Company_Name_qcq);
            parameters.Add("@Period_Year_qcq", request.Period_Year_qcq);
            parameters.Add("@Period_Quarter_qcq", request.Period_Quarter_qcq);
            parameters.Add("@Salesforce_Name_qcq", request.Salesforce_Name_qcq);
            parameters.Add("@Type_of_Salesforce_qcq", request.Type_of_Salesforce_qcq);
            parameters.Add("@Number_Of_Sales_Representatives_qcq", request.Number_Of_Sales_Representatives_qcq);
            parameters.Add("@Number_Of_District_Managers_qcq", request.Number_Of_District_Managers_qcq);
            parameters.Add("@Number_Of_Regional_Managers_qcq", request.Number_Of_Regional_Managers_qcq);
            parameters.Add("@Salary_Low_qcq", request.Salary_Low_qcq);
            parameters.Add("@Salary_High_qcq", request.Salary_High_qcq);
            parameters.Add("@Target_Bonus_qcq", request.Target_Bonus_qcq);
            parameters.Add("@Reach_qcq", request.Reach_qcq);
            parameters.Add("@Frequency_qcq", request.Frequency_qcq);

            var productTable = new DataTable();
            productTable.Columns.Add("DADatabase_Product_Id", typeof(string));
            productTable.Columns.Add("DADatabase_Salesforce_Id", typeof(string));
            productTable.Columns.Add("US_Product_Name_Product_Promoted", typeof(string));
            productTable.Columns.Add("Country_Specific_Product_Name_Product_Promoted", typeof(string));
            productTable.Columns.Add("Generic_Name", typeof(string));
            productTable.Columns.Add("Therapeutic_Category", typeof(string));
            productTable.Columns.Add("Product_Promotion_Priority_Order", typeof(int));
            productTable.Columns.Add("Total_Number_of_Full_Time_Equivalents_FTEs", typeof(float));
            productTable.Columns.Add("Primary_Care_Full_Time_Equivalents_FTEs", typeof(float));
            productTable.Columns.Add("Specialty_Full_Time_Equivalents_FTEs", typeof(float));
            productTable.Columns.Add("Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians", typeof(string));
            productTable.Columns.Add("Specialty_Physicians_Targeted", typeof(string));
            productTable.Columns.Add("Co_Promotion_YesNo", typeof(bool));
            productTable.Columns.Add("Name_of_a_Partner_Company", typeof(string));
            productTable.Columns.Add("Contract_Sales_Force_YesNo", typeof(bool));
            productTable.Columns.Add("Name_of_a_CSO_Contract_Sales_Organization", typeof(string));
            productTable.Columns.Add("Additional_Notes_Product", typeof(string));

            productTable.Columns.Add("US_Product_Name_Product_Promoted_qcq", typeof(string));
            productTable.Columns.Add("Country_Specific_Product_Name_Product_Promoted_qcq", typeof(string));
            productTable.Columns.Add("Generic_Name_qcq", typeof(string));
            productTable.Columns.Add("Therapeutic_Category_qcq", typeof(string));
            productTable.Columns.Add("Product_Promotion_Priority_Order_qcq", typeof(string));
            productTable.Columns.Add("Total_Number_of_Full_Time_Equivalents_FTEs_qcq", typeof(string));
            productTable.Columns.Add("Primary_Care_Full_Time_Equivalents_FTEs_qcq", typeof(string));
            productTable.Columns.Add("Specialty_Full_Time_Equivalents_FTEs_qcq", typeof(string));
            productTable.Columns.Add("Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq", typeof(string));
            productTable.Columns.Add("Specialty_Physicians_Targeted_qcq", typeof(string));
            productTable.Columns.Add("Co_Promotion_YesNo_qcq", typeof(string));
            productTable.Columns.Add("Name_of_a_Partner_Company_qcq", typeof(string));
            productTable.Columns.Add("Contract_Sales_Force_YesNo_qcq", typeof(string));
            productTable.Columns.Add("Name_of_a_CSO_Contract_Sales_Organization_qcq", typeof(string));

            if (request.ProductItems != null && request.ProductItems.Count > 0)
            {
                foreach (var product in request.ProductItems)
                {
                    product.Total_Number_of_Full_Time_Equivalents_FTEs
                          = (float)Convert.ToDouble(product.Primary_Care_Full_Time_Equivalents_FTEs)
                           + (float)Convert.ToDouble(product.Specialty_Full_Time_Equivalents_FTEs);
                }
            }

            foreach (var product in request.ProductItems)
            {
                productTable.Rows.Add(
                    product.DADatabase_Product_Id,
                    product.DADatabase_Salesforce_Id,
                    product.US_Product_Name_Product_Promoted,
                    product.Country_Specific_Product_Name_Product_Promoted,
                    product.Generic_Name,
                    product.Therapeutic_Category,
                    product.Product_Promotion_Priority_Order,
                    product.Total_Number_of_Full_Time_Equivalents_FTEs,
                    product.Primary_Care_Full_Time_Equivalents_FTEs,
                    product.Specialty_Full_Time_Equivalents_FTEs,
                    product.Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians,
                    product.Specialty_Physicians_Targeted,
                    product.Co_Promotion_YesNo,
                    product.Name_of_a_Partner_Company,
                    product.Contract_Sales_Force_YesNo,
                    product.Name_of_a_CSO_Contract_Sales_Organization,
                    product.Additional_Notes_Product,
                    product.US_Product_Name_Product_Promoted_qcq,
                    product.Country_Specific_Product_Name_Product_Promoted_qcq,
                    product.Generic_Name_qcq,
                    product.Contract_Sales_Force_YesNo_qcq,
                    product.Therapeutic_Category_qcq,
                    product.Product_Promotion_Priority_Order_qcq,
                    product.Total_Number_of_Full_Time_Equivalents_FTEs_qcq,
                    product.Primary_Care_Full_Time_Equivalents_FTEs_qcq,
                    product.Specialty_Full_Time_Equivalents_FTEs_qcq,
                    product.Physicians_Focus_Primary_Care_Physicians_Specialty_Physicians_qcq,
                    product.Specialty_Physicians_Targeted_qcq,
                    product.Co_Promotion_YesNo_qcq,
                    product.Name_of_a_Partner_Company_qcq,
                    product.Name_of_a_CSO_Contract_Sales_Organization_qcq
                    
                );
            }


            parameters.Add("@Products", productTable.AsTableValuedParameter("dbo.DADatabase_Product_Type"));

            return await UpdateAsync(parameters, StoreProcedures.UpdateDataManager);
        }
        public async Task<int> DeleteDataManagerAsync(string id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@DA_Database_FTE_ID", id);
            parameters.Add("@user_id", 0);

            return await DeleteAsync(parameters, StoreProcedures.DeleteDataManager);
        }

        public async Task<DataManagerFilterSetResponse> GetDMSalesforceRecordsFiltersAsync(DataManagerFilterListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var multiQuery = await connection.QueryMultipleAsync(StoreProcedures.GetDMSalesforceRecordsFilters, parameters, commandType: CommandType.StoredProcedure);

                // Construct response object
                var response = new DataManagerFilterSetResponse();

                response.Country_Name = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Company_Name = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.SalesForce_Name = (await multiQuery.ReadAsync<SalesForceOptions>()).ToList();
                response.Period_Year = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Type_of_salesforce = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Physician_Focus = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Us_Brand_Name = (await multiQuery.ReadAsync<ProductOptions>()).ToList();
                response.Country_Specific_Product = (await multiQuery.ReadAsync<ProductOptions>()).ToList();
                response.Generic_Name = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Therapeutic_Category = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Name_of_cso = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Physician_Targeted = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Period = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Currency_Symbol = (await multiQuery.ReadAsync<IdNamePair>()).ToList();

                return response;
            }
        }

        public async Task<int> PublishDataManagerAsync(PublishDataManager publishDataManager)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", publishDataManager.user_id);
            parameters.Add("@publish_from_datamanager", publishDataManager.Publish_From_Datamanager);
            parameters.Add("@security_token", publishDataManager.security_token);
            parameters.Add("@ReturnVal", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await AddAsync(parameters, StoreProcedures.PublishDataManagerStagingData);
            var result = parameters.Get<int>("@ReturnVal");
            return result;

        }

        public async Task<int> DeleteDMSalesforceRecordAsync(int user_id, string DADatabase_Salesforce_Id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", user_id);
            parameters.Add("@DADatabase_Salesforce_Id", DADatabase_Salesforce_Id);

            return await DeleteAsync(parameters, StoreProcedures.DeleteDMSalesforceRecord);
        }

        public async Task<DataManagerListResponse> GetCompensationSalesForceRecordsAsync(CompensationListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@pagesize", request.pageSize);
            parameters.Add("@page", request.page);
            parameters.Add("@regionId", request.regionId);
            parameters.Add("@countryId", request.countryId);
            parameters.Add("@companyId", request.companyId);
            parameters.Add("@periodId", request.periodId);
            parameters.Add("@salesforceName", request.salesforceName);
            parameters.Add("@therapeuticCategory_Id",request.therapeuticCategory_Id);
            parameters.Add("@productName", request.productName);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@sort_direction", request.SortDirection);
            parameters.Add("@sort_field", request.SortField);
            parameters.Add("@total_records", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await GetAllAsync(parameters, StoreProcedures.GetCompensationSalesForceRecords);
            int totalRecords = parameters.Get<int>("@total_records");

            var response = new DataManagerListResponse()
            {
                Records = result,
                TotalRecords = totalRecords
            };

            return response;
        }

        public async Task<IReadOnlyList<IdNamePair>> GetCompensationRecordsFiltersAsync(CompensationFilterRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@type", request.type);
            parameters.Add("@regionId", request.regionId);
            parameters.Add("@countryId", request.countryId);
            parameters.Add("@companyId", request.companyId);
            parameters.Add("@periodId", request.periodId);
            parameters.Add("@salesforce_Id", request.salesforce_Id);
            parameters.Add("@therapeuticCategory_Id", request.therapeuticCategory_Id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<IdNamePair>(StoreProcedures.GetCompensationRecordsFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<CallPlaningListResponse> GetCallPlanningRecordsAsync(CallPlanningListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@pagesize", request.pageSize);
            parameters.Add("@page", request.page);
            parameters.Add("@regionId", request.regionId);
            parameters.Add("@countryId", request.countryId);
            parameters.Add("@companyId", request.companyId);
            parameters.Add("@periodId", request.periodId);
            parameters.Add("@salesforceName", request.salesforceName);
            parameters.Add("@therapeuticCategory_Id", request.therapeuticCategory_Id);
            parameters.Add("@productName", request.productName);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@sort_direction", request.SortDirection);
            parameters.Add("@sort_field", request.SortField);
            parameters.Add("@total_records", dbType: DbType.Int32, direction: ParameterDirection.Output);

            

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                //var result = await GetAllAsync(parameters, StoreProcedures.GetCallPlanningRecords);
               
                var result = await connection.QueryAsync<CallPlanningModel>(StoreProcedures.GetCallPlanningRecords, parameters, commandType: CommandType.StoredProcedure);
                int totalRecords = parameters.Get<int>("@total_records");

                var response = new CallPlaningListResponse()
                {
                    Records = result.ToList(),
                    TotalRecords = totalRecords
                };

                return response;
            }

            
        }

        public async Task<IReadOnlyList<IdNamePair>> GetCallPlanningFiltersAsync(CallPlanningFilterRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@type", request.type);
            parameters.Add("@regionId", request.regionId);
            parameters.Add("@countryId", request.countryId);
            parameters.Add("@companyId", request.companyId);
            parameters.Add("@periodId", request.periodId);
            parameters.Add("@salesforce_Id", request.salesforce_Id);
            parameters.Add("@therapeuticCategory_Id", request.therapeuticCategory_Id);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<IdNamePair>(StoreProcedures.GetCompensationRecordsFilters, parameters, commandType: CommandType.StoredProcedure);

                return result.ToList();
            }
        }

        public async Task<DataManagerFilterSetResponse> GetDataManagerRecordsFiltersAsync(DataManagerFilterListRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@caller", request.caller);
            parameters.Add("@security_token", request.security_token);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var multiQuery = await connection.QueryMultipleAsync(StoreProcedures.GetDMGridFilters, parameters, commandType: CommandType.StoredProcedure);

                // Construct response object
                var response = new DataManagerFilterSetResponse();

                response.Country_Name = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Company_Name = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.SalesForce_Name = (await multiQuery.ReadAsync<SalesForceOptions>()).ToList();
                response.Period_Year = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Type_of_salesforce = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Physician_Focus = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Us_Brand_Name = (await multiQuery.ReadAsync<ProductOptions>()).ToList();
                response.Country_Specific_Product = (await multiQuery.ReadAsync<ProductOptions>()).ToList();
                response.Generic_Name = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Therapeutic_Category = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Name_of_cso = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Physician_Targeted = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Period = (await multiQuery.ReadAsync<IdNamePair>()).ToList();
                response.Currency_Symbol = (await multiQuery.ReadAsync<IdNamePair>()).ToList();

                return response;
            }
        }

        public async Task<int> UpdateDataManagerRecordInlineEditAsync(DataManagerModel request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@security_token", request.security_token);
            parameters.Add("@DADatabase_Salesforce_Id", request.DADatabase_Salesforce_Id);
            parameters.Add("@DADatabase_Product_Id", request.DADatabase_Product_Id);
            parameters.Add("@Total_Number_of_Full_Time_Equivalents_FTEs", request.Total_Number_of_Full_Time_Equivalents_FTEs);
            parameters.Add("@Primary_Care_Full_Time_Equivalents_FTEs", request.Primary_Care_Full_Time_Equivalents_FTEs);
            parameters.Add("@Specialty_Full_Time_Equivalents_FTEs", request.Specialty_Full_Time_Equivalents_FTEs);
            parameters.Add("@Product_Promotion_Priority_Order", request.Product_Promotion_Priority_Order);
            parameters.Add("@Number_Of_Sales_Representatives", request.Number_Of_Sales_Representatives);
            parameters.Add("@Number_Of_District_Managers", request.Number_Of_District_Managers);
            parameters.Add("@Number_Of_Regional_Managers", request.Number_Of_Regional_Managers);
            parameters.Add("@Salary_Low", request.Salary_Low);
            parameters.Add("@Salary_High", request.Salary_High);
            parameters.Add("@Target_Bonus", request.Target_Bonus);
            parameters.Add("@Reach", request.Reach);
            parameters.Add("@Frequency", request.Frequency);

            return await UpdateAsync(parameters, StoreProcedures.UpdateDataManagerRecordInlineEdit);
        }

        public async Task<List<EmailModel>> SendNotificationEmailListAsync(BaseRequest request)
        {
            List<EmailModel> emailList = new List<EmailModel>();

            string subject = "Company/Product Change Alert";
            string body = $"Hello [Username],\r\n\r\nOne or more companies or products you listed under your favorites in DA2.0 have been updated. \r\n\r\nBest,\r\n\r\nDA2.0 Team";


            var parameters = new DynamicParameters();
            parameters.Add("@user_id", request.user_id);
            parameters.Add("@client_id", request.client_id);
            parameters.Add("@security_token", request.security_token);

            using (var connection = new SqlConnection(_config.GetConnectionString(Constants.DBConnection)))
            {
                await connection.OpenAsync();

                var result = await connection.QueryAsync<UpdatedFavoritesForEmailNotificationModel>(StoreProcedures.GetUpdatedFavoritesForEmailNotification, parameters, commandType: CommandType.StoredProcedure);

                foreach (var item in result)
                {
                    var email = new EmailModel();
                    email.Subject = subject;
                    email.ToEmailAddress = item.Email;
                    email.Body = body.Replace("[Username]", item.username);

                    emailList.Add(email);
                }
            }

            //return await SendEmailNow(emailList,subject,body);
            return emailList;
        }

        private async Task<int> SendEmailNow(List<string> emailAddressList,string subject,string body)
        {
            int result;
            try
            {
                LicenseMailSetting mailSetting = new LicenseMailSetting();
                mailSetting.SMTPEmailFrom = _config["LicenseMailSettings:SMTPEmailFrom"];
                mailSetting.GmailSMTPPort = Convert.ToInt32(_config["LicenseMailSettings:GmailSMTPPort"]);
                mailSetting.GmailSMTPSSL = Convert.ToBoolean(_config["LicenseMailSettings:GmailSMTPSSL"]);
                mailSetting.GmailSMTPServer = _config["LicenseMailSettings:GmailSMTPServer"];
                mailSetting.GmailSMTPPwd = _config["LicenseMailSettings:GmailSMTPPwd"];
                mailSetting.GmailSMTPUserName = _config["LicenseMailSettings:GmailSMTPUserName"];


                SmtpClient mySmtpClient = new SmtpClient(mailSetting.GmailSMTPServer);

                mySmtpClient.UseDefaultCredentials = false;
                mySmtpClient.EnableSsl = mailSetting.GmailSMTPSSL;
                mySmtpClient.Port = mailSetting.GmailSMTPPort;
                System.Net.NetworkCredential basicAuthenticationInfo = new
                System.Net.NetworkCredential(mailSetting.GmailSMTPUserName, mailSetting.GmailSMTPPwd);
                mySmtpClient.Credentials = basicAuthenticationInfo;

                //MailAddress from = new MailAddress(mailSetting.SMTPEmailFrom ?? "", "No Reply");
                MailMessage myMail = new System.Net.Mail.MailMessage();

                myMail.Subject = $"Deployment Analyzer - {subject}";
                myMail.SubjectEncoding = System.Text.Encoding.UTF8;

                myMail.BodyEncoding = System.Text.Encoding.UTF8;
                myMail.IsBodyHtml = true;

                foreach (var email in emailAddressList)
                {
                    try
                    {
                        myMail.From = new MailAddress(mailSetting.SMTPEmailFrom ?? "", "No Reply");
                        myMail.To.Clear();
                        myMail.To.Add(email);
                        string username = email.Split("@").FirstOrDefault() ?? "Concern";
                        myMail.Body = body.Replace("[Username]", username);

                        mySmtpClient.Send(myMail);
                    }
                    catch
                    {
                        continue;
                    }
                    
                }

                result = 1;
            }
            catch
            {
                result = 0;
            }

            return await Task.FromResult(result);
        }
    }

}
