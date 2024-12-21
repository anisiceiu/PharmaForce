namespace DeploymentAnalyzer.Utility.Constants
{
    public static class StoreProcedures
    {
        #region Job Schedulers
        public readonly static string RunJobForQuaterly = "RunJobForQuaterly";
        #endregion

        #region News Management
        public readonly static string GetAllNews = "GetAllNews";
        public readonly static string GetNewsById = "GetNewsById";
        public readonly static string AddNews = "AddNews";
        public readonly static string UpdateNews = "UpdateNews";
        public readonly static string DeleteNews = "DeleteNews";
        public readonly static string GetNewsList = "GetNewsList";
        #endregion

        #region Company
        public readonly static string GetAllCompany = "GetAllCompany";
        public readonly static string GetCompanyById = "GetCompanyById";
        public readonly static string AddCompany = "AddCompany";
        public readonly static string UpdateCompany = "UpdateCompany";
        public readonly static string DeleteCompany = "DeleteCompany";
        #endregion

        #region Company Profile
        public readonly static string GetCompaniesForUserProfile = "GetCompaniesForUserProfile";
        public readonly static string AddRemoveFavoriteCompany = "AddRemoveFavoriteCompany";
        public readonly static string GetFavoriteCompanyProfile = "GetFavoriteCompanyProfile";
        public readonly static string GetCompanyProfileRecords = "GetCompanyProfileRecords";
        public readonly static string GetCompanyProfileTopInfo = "GetCompanyProfileInfo";
        public readonly static string GetTherapeuticCategoryWiseCompanyInfo = "GetTherapeuticCategoryWiseCompanyInfo";
        public readonly static string GetCompanyProfileAdditionalNotes = "GetCompanyProfileAdditionalNotes";
        public readonly static string GetCompanyUpdate = "GetCompanyUpdate";
        public readonly static string SubscribeUnSubscribeFavoriteCompany = "SubscribeUnSubscribeFavoriteCompany";
        #endregion

        #region Product Profile
        public readonly static string GetProductsForUserProfile = "GetProductsForUserProfile";
        public readonly static string AddRemoveFavoriteProduct = "AddRemoveFavoriteProduct";
        public readonly static string GetFavoriteProductProfile = "GetFavoriteProductProfile";
        public readonly static string GetProductProfileRecords = "GetProductProfileRecords";
        public readonly static string GetProductProfileInfo = "GetProductProfileInfo";
        public readonly static string GetTherapeuticCategoryWiseProductInfo = "GetTherapeuticCategoryWiseProductInfo";
        public readonly static string GetProductProfileAdditionalNotes = "GetProductProfileAdditionalNotes";
        public readonly static string SubscribeUnSubscribeFavoriteProduct = "SubscribeUnSubscribeFavoriteProduct";
        #endregion

        #region Region
        public readonly static string GetRegions = "GetRegions";
        public readonly static string GetRegionOnlyWithCountry = "GetRegionOnlyWithCountry";
        #endregion

        #region Country
        public readonly static string GetCountries = "GetCountries";
        #endregion

        #region Data Manager
        public readonly static string GetDMSalesforceRecords = "GetDMSalesforceRecords";
        public readonly static string GetDataManagerById = "GetDMSalesforceRecordById";
        public readonly static string GetSalesForceDataManagerItemById = "GetSalesForceDataManagerItemById";
        public readonly static string GetProductionDataManagerById = "GetDMSalesforceRecordInProductionById";
        public readonly static string GetDataManagerProductionById = "GetFTEByID";
        public readonly static string AddDataManager = "AddDMSalesforceRecord";
        public readonly static string UpdateDataManager = "UpdateDMSalesforceRecord";
        public readonly static string DeleteDataManager = "DeleteDMSalesforceRecord";
        public readonly static string GetDMSalesforceRecordsFilters = "GetDMSalesforceRecordsFilters";
        public readonly static string PublishDataManagerStagingData = "PublishDataManagerStagingData";
        public readonly static string DeleteDMSalesforceRecord = "DeleteDMSalesforceRecord";
        public readonly static string GetDMCompaniesForCountry = "GetDMCompaniesForCountry";
        public readonly static string GetDMPeriodSalesforceForCompany = "GetDMPeriodSalesforceForCompany";
        public readonly static string GetDMGridFilters = "GetDMGridFilters";
        public readonly static string UpdateDataManagerRecordInlineEdit = "UpdateDataManagerRecord";
        public readonly static string GetUpdatedFavoritesForEmailNotification = "GetUpdatedFavoritesForEmailNotification";
        #endregion

        #region Data Manager Products
        public readonly static string GetDataManagerProducts = "GetAllDADatabaseProduct";
        //public readonly static string GetDataManagerById = "GetDADatabaseFTEById";
        //public readonly static string AddDataManager = "AddDADatabaseFTE";
        //public readonly static string UpdateDataManager = "UpdateDADatabase";
        //public readonly static string DeleteDataManager = "DeleteDADatabase";
        public readonly static string DeleteDMProductRecord = "DeleteDMProductRecord";
        #endregion

        #region citation
        public readonly static string GetCitation = "GetCitation";
        public readonly static string AddUpdateCitation = "AddUpdateCitation";
        public readonly static string DeleteCitation = "DeleteCitation";
        public readonly static string GetCitationManager = "GetCitationManager";
        public readonly static string GetCitationsForDM = "GetCitationsForDM";
        public readonly static string GetCitationsByIdCSV = "GetCitationsByIdCSV";
        #endregion

        #region MasterCode
        public readonly static string GetMasterCodes = "GetMasterCodes";

        public readonly static string GetMasterCodeCategories = "GetMasterCodeCategories";
        public readonly static string AddUpdateMastercode = "AddUpdateMasterCode";
        public readonly static string DeleteMastercode = "DeleteMasterCode";
        public readonly static string GetAdminCurrentPeriod = "GetAdminCurrentPeriod";
        public readonly static string GetMasterCodeAddFilters = "GetMasterCodeAddFilters";
        public readonly static string GetMasterCodeRecords = "GetMasterCodeRecords";
        public readonly static string GetMasterCodeFilters = "GetMasterCodeFilters";
        #endregion

        #region Notes
        public readonly static string GetNotes = "GetNotes";
        public readonly static string AddUpdateNotes = "AddUpdateNote";
        public readonly static string DeleteNotes = "DeleteNote";
        #endregion

        #region QCQueues
        public readonly static string GetQCQueues = "GetQCQueues";
        public readonly static string AddQCQueues = "AddToQC";
        public readonly static string DeleteQCQueues = "DeleteQCQueue";
        public readonly static string ApproveQCQueue = "ApproveQCQueue";
        public readonly static string GetQCHistories = "GetQCHistories";
        #endregion

        #region User
        public readonly static string Admin_GetCompanies = "dep_Admin_GetCompanies";
        public readonly static string Admin_GetCountries = "dep_Admin_GetCountries";
        public readonly static string Admin_GetFunctions = "dep_Admin_GetFunctions";
        public readonly static string GetAdminUsers = "dep_Admin_QryAdminUsers";
        public readonly static string GetQueryUsers = "dep_qryUsers";
        public readonly static string GetUser = "dep_Admin_GetUser";
        public readonly static string AddUser = "dep_Admin_addUser";
        public readonly static string UpdateUser = "dep_Admin_updUser";
        public readonly static string DisableAdminUsers = "dep_Admin_DisableAdminUsers";
        public readonly static string RemoveAdminUsers = "dep_Admin_RemoveAdminUsers";
        public readonly static string GetUserExpiry = "dep_Admin_qryUserExpiry";
        public readonly static string UpdateUserExpiry = "dep_Admin_UpdateUserExpiry";
        public readonly static string GetAllUser = "dep_qryUsers";
        public readonly static string VerifyUserForLogin = "VerifyUserForLogin";
        public readonly static string InsertClientReverificationCode = "dep_insClientReverificationCode_New";
        public readonly static string ActivateClient_New = "dep_ActivateClient_New";
        public readonly static string GetUserLoginDetail = "dep_qryUserLoginLog";
        public readonly static string GetAdminUser = "dep_GetAdminUser";
        #endregion

        #region Dep_User
        public readonly static string GetUnlockedUser = "dep_GetLockedUsers";
        public readonly static string UnlockUser = "dep_UnlockUser";
        public readonly static string DeleteUser = "DeleteUser";
        #endregion

        #region UserEmailSuffix
        public readonly static string GetUserEmailSuffix = "dep_qryUserEmailSuffixList";
        public readonly static string AddUserEmailSuffix = "dep_insUserEmailSuffix";
        public readonly static string DeleteUserEmailSuffix = "dep_delUserEmailSuffix";
        public readonly static string GetUserRestrictedEmailSuffix = "dep_qryUserRestrictedEmailSuffixList";
        public readonly static string AddUserRestrictedEmailSuffix = "dep_insUserRestrictedEmailSuffix";
        public readonly static string DeleteRestrictedUserEmailSuffix = "dep_delUserRestrictedEmailSuffix";
        #endregion

        #region User Access Rights
        // public readonly static string Admin_GetCountries = "dep_Admin_GetCountries";
        public readonly static string Admin_GetTherapeuticCategories = "dep_Admin_GetTherapeuticCategories";
        public readonly static string Admin_GetPeriod = "dep_Admin_GetPeriod";
        public readonly static string GetUserRights = "dep_qryUserRights";
        public readonly static string UpdateUserRights = "dep_UpdateUserRights";
        public readonly static string GetAllCompanyCountry = "GetAllCompanyCountry";
        public readonly static string AddAdminPermission = "dep_Admin_AddAdminPermission";
        public readonly static string UpdateAdminPermission = "dep_Admin_UpdateAdminPermission";
        public readonly static string GetAdminPermissionsByUserID = "dep_Admin_GetAdminPermissionsByUserID";
        #endregion

        #region UserClients
        public readonly static string AddUserClient = "dep_insUser_Client";
        public readonly static string GetUserClientList = "dep_GetUserClientList";
        public readonly static string LockUnlockClientAccount = "dep_LockUnlockClientAccount";
        public readonly static string UnsubscribeClient = "dep_UnsubscribeClient";
        public readonly static string WaiveActivationToClient = "dep_WaiveActivationToClient";
        public readonly static string DeleteUserClient = "dep_delUserClient";
        public readonly static string ActiveDeactiveToClient = "dep_ActiveDeactiveToClient";
        public readonly static string AddNewUserClient = "AddNewUserClient";
        #endregion

        #region User Preferences
        public readonly static string GetUserPreference = "GetUserPreference";
        public readonly static string AddUpdateUserPreference = "AddUpdateUserPreference";
        public readonly static string AddUpdateUserAnalyticFilters = "AddUpdateUserAnalyticFilters";
        public readonly static string GetUserAnalyticFilters = "GetUserAnalyticFilters";
        #endregion

        #region AdminLog
        public readonly static string GetAdminLog = "GetAdminLog"; 
        public readonly static string UpdateEventEmailConfig = "UpdateEventEmailConfig";
        public readonly static string GetAllEventEmailConfig = "GetAllEventEmailConfig";
        public readonly static string GetEventEmailConfigByEventName = "GetEventEmailConfigByEventName";
        #endregion

        #region UpdateManagement
        public readonly static string GetKeyUpdates = "GetKeyUpdates";
        public readonly static string DeleteKeyUpdate = "DeleteKeyUpdate";
        public readonly static string AddUpdateKeyUpdate = "AddUpdateKeyUpdate";
        public readonly static string GetTherapeuticCategories = "dep_GetTherapeuticCategories";
        public readonly static string GetKeyUpdateTags = "GetKeyUpdateTags";
        public readonly static string GetKeyUpdatesList = "GetKeyUpdatesList";
        #endregion

        #region Compensations
        public readonly static string GetCompensationRecordsFilters = "GetCompensationRecordsFilters";
        public readonly static string GetCompensationSalesForceRecords = "GetCompensationSalesForceRecords";
        #endregion

        #region Call Planning
        public readonly static string GetCallPlanningRecords = "GetCallPlanningRecords";
        #endregion

        #region Brand
        public readonly static string GetMyBrandsGroupNames = "dep_GetMyBrandsGroupNames";
        public readonly static string DeleteMyBrandGroup = "dep_DeleteMyBrands";
        public readonly static string AddUpdateMyBrandGroup = "AddUpdateMyBrand";
        public readonly static string GetBrandGroupFilters = "GetBrandGroupFilters";
        public readonly static string GetCompanyTherapeuticCategoryByMyBrandId = "GetCompanyTherapeuticCategoryByBrandId";
        #endregion

        #region Generic Name
        public readonly static string GetGenericNameList = "GetGenericNameList";
        #endregion

        #region Salesforce
        public readonly static string GetSalesforceList = "GetSalesforceList";
        #endregion

        #region Analytics
        public readonly static string GetAnalyticsSalesRepresentativeCompensationBySalesForceAndProductGrid = "GetAnalyticsSalesRepresentativeCompensationBySalesForceAndProductGrid";
        public readonly static string GetAnalyticsSalesRepresentativeCompensationBySalesForceAndProductChart = "GetAnalyticsSalesRepresentativeCompensationBySalesForceAndProductChart";
        public readonly static string GetAnalyticsReachAndFrequencyBySalesForceAndProductGrid = "GetAnalyticsReachAndFrequencyBySalesForceAndProductGrid";
        public readonly static string GetAnalyticsReachAndFrequencyBySalesForceAndProductChart = "GetAnalyticsReachAndFrequencyBySalesForceAndProductChart";
        public readonly static string GetAnalyticsProductFTEsByTCAndSalesForceUsingGenericNameGrid = "GetAnalyticsProductFTEsByTCAndSalesForceUsingGenericNameGrid";
        public readonly static string GetAnalyticsProductFTEsByTCAndSalesForceUsingGenericNameChart = "GetAnalyticsProductFTEsByTCAndSalesForceUsingGenericNameChart";
        public readonly static string GetAnalyticsProductFTEsByTCAndSalesForceUsingBrandGrid = "GetAnalyticsProductFTEsByTCAndSalesForceUsingBrandGrid";
        public readonly static string GetAnalyticsProductFTEsByTCAndSalesForceUsingBrandChart = "GetAnalyticsProductFTEsByTCAndSalesForceUsingBrandChart";
        public readonly static string GetAnalyticsCompanyPortfolioByTCAndSalesForceGrid = "GetAnalyticsCompanyPortfolioByTCAndSalesForceGrid";
        public readonly static string GetAnalyticsCompanyPortfolioByTCAndSalesForceChart = "GetAnalyticsCompanyPortfolioByTCAndSalesForceChart";
        public readonly static string GetAnalyticsCompanyDeploymentByCountryGrid = "GetAnalyticsCompanyDeploymentByCountryGrid";
        public readonly static string GetAnalyticsCompanyDeploymentByCountryChart = "GetAnalyticsCompanyDeploymentByCountryChart";
        public readonly static string GetAnalyticsCompanyDeploymentByCountryAndTCGrid = "GetAnalyticsCompanyDeploymentByCountryAndTCGrid";
        public readonly static string GetAnalyticsCompanyDeploymentByCountryAndTCChart = "GetAnalyticsCompanyDeploymentByCountryAndTCChart";
        public readonly static string GetAnalyticsCompanyCountryAnalysisGrid = "GetAnalyticsCompanyCountryAnalysisGrid";
        public readonly static string GetAnalyticsCompanyCountryAnalysisChart = "GetAnalyticsCompanyCountryAnalysisChart";
        public readonly static string AddUserAnalyticSearchLog = "AddUserAnalyticSearchLog";
        public readonly static string DeleteUserAnalyticsSavedFilter = "DeleteUserAnalyticsSavedFilter";
        #endregion
        #region Common
        public readonly static string GetCustomerDropdownList = "GetCustomerDropdownList";
        public readonly static string GetCompanyProductProfileUserFilters = "GetCompanyProductProfileUserFilters";
        public readonly static string AddUpdateCompanyProductProfileUserFilters = "AddUpdateCompanyProductProfileUserFilters";
        #endregion
    }
}
