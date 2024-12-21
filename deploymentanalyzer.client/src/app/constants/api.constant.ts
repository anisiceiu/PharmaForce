import { environment } from "../../environments/environment";

export const rootPath = environment.baseUrl;

export const accountRootPath = rootPath + 'account/';
export const login = accountRootPath + "login";
export const refreshToken = accountRootPath + "RefreshToken";
export const adminLogin = accountRootPath + "AdminLogin";
export const checkUser = accountRootPath + "CheckUser";
export const verifyOTP = accountRootPath + "VerifyOTP";
export const proceedClientLogin = accountRootPath + "ProceedClientLogin";
export const lockClientAccount = accountRootPath + 'LockClientAccount';

export const companyRootPath = rootPath + 'company/';
export const getAllCompany = companyRootPath + "GetAllCompany";
export const getCompanyById = companyRootPath + "GetCompanyById/";
export const addCompany = companyRootPath + "AddCompany";
export const updateCompany = companyRootPath + "UpdateCompany";
export const deleteCompany = companyRootPath + "DeleteCompany/";
export const getAdminCompanies = companyRootPath + "GetAdminCompanies";

export const masterCodeRootPath = rootPath + 'mastercode/';
export const getMasterCode = masterCodeRootPath + 'GetMasterCode';
export const getMasterCodeByCategory = masterCodeRootPath + 'GetMasterCodeByCategory';
export const getMasterCodeAllCategories = masterCodeRootPath + 'GetMasterCodeAllCategories';
export const addUpdateMasterCode = masterCodeRootPath + 'AddUpdateMasterCode';
export const deleteMasterCode = masterCodeRootPath + 'DeleteMasterCode/';
export const getAdminCurrentPeriod = masterCodeRootPath + 'GetAdminCurrentPeriod';
export const GetMasterCodeAddFilters = masterCodeRootPath + 'GetMasterCodeAddFilters';
export const GetMasterCodeFilters = masterCodeRootPath + 'GetMasterCodeFilters';
export const GetMasterCodeRecords = masterCodeRootPath + 'GetMasterCodeRecords';
export const GetMasterCodeUSNameFilters = masterCodeRootPath + 'GetMasterCodeUSNameFilters';

export const dataManagerRootPath = rootPath + 'datamanager/';
export const getAllDataManagerItems = dataManagerRootPath + "GetDataManagerSalesforce";
export const getDataManagerItemById = dataManagerRootPath + "GetDataManagerItemById";
export const getSalesForceDataManagerItemById = dataManagerRootPath + "GetSalesForceDataManagerItemById";
export const getProductionDataManagerItemById = dataManagerRootPath + 'GetProductionDataManagerItemById';
export const addNewDataManagerItem = dataManagerRootPath + "AddNewDataManagerItem";
export const updateDataManagerItem = dataManagerRootPath + "UpdateDataManagerItem";
export const deleteDataManagerItem = dataManagerRootPath + "DeleteDataManagerItem/";
export const GetDMSalesforceRecordsFilters = dataManagerRootPath + "GetDMSalesforceRecordsFilters";
export const publishDataManagerItems = dataManagerRootPath + "PublishDataManagerItems";
export const deleteDMSalesforceRecord = dataManagerRootPath + "DeleteDMSalesforceRecord";
export const getDMCompaniesForCountry = dataManagerRootPath + 'GetDMCompaniesForCountry';
export const getDMPeriodSalesforceForCompany = dataManagerRootPath + 'GetDMPeriodSalesforceForCompany';
export const getCompensationSalesForceRecords = dataManagerRootPath + 'GetCompensationSalesForceRecords';
export const getCompensationRecordsFilters = dataManagerRootPath + 'GetCompensationRecordsFilters';
export const getCallPlanningRecords = dataManagerRootPath + 'GetCallPlanningRecords';
export const getCallPlanningFilters = dataManagerRootPath + 'GetCallPlanningFilters';
export const GetDataManagerRecordsFilters = dataManagerRootPath + "GetDataManagerRecordsFilters";
export const UpdateDataManagerItemInlineEdit = dataManagerRootPath + "UpdateDataManagerItemInlineEdit";
export const GetDataManagerSalesforceExcelData = dataManagerRootPath + 'GetDataManagerSalesforceExcelData';
export const citationRootPath = rootPath + 'citation/';
export const GetAllCitation = citationRootPath + "GetCitation";
export const addUpdateCitation = citationRootPath + "AddUpdateCitation";
export const GetCitationManager = citationRootPath + "GetCitationManager";
export const getCitationsForDM = citationRootPath + "GetCitationsForDM";
export const GetCitationsByIdCSV = citationRootPath + "GetCitationsByIdCSV";

export const notesRootPath = rootPath + 'notes/';
export const getNotes = notesRootPath + "GetNotes";
export const addUpdateNotes = notesRootPath + "AddUpdateNotes";

export const qcqueuesRootPath = rootPath + 'qcqueues/';
export const GetAllqcqueues = qcqueuesRootPath + "GetQCQueues";
export const Approveqcqueues = qcqueuesRootPath + "ApproveQCQueues";
export const RejectQCQueues = qcqueuesRootPath + "RejectQCQueues";
export const GetQCHistories = qcqueuesRootPath + "GetQCHistories";

export const newsmanagementRootPath = rootPath + 'NewsManagement/';
export const GetallNews = newsmanagementRootPath + "GetAllNews";
export const GetNewsById = newsmanagementRootPath + "GetNewsById";
export const AddNews = newsmanagementRootPath + "AddNews";
export const DeleteNews = newsmanagementRootPath + "DeleteNews/";
export const UpdateNews = newsmanagementRootPath + "UpdateNews";
export const GetNewsList = newsmanagementRootPath + 'GetNewsList';

export const administratorRootPath = rootPath + 'SuperAdministrator/';
export const getAdminUsers = administratorRootPath + 'GetAdminUser';
export const getClientUsers = administratorRootPath + 'GetClientUser';
export const getUsers = administratorRootPath + 'GetUser';
export const addUser = administratorRootPath + 'AddUser';
export const updateUser = administratorRootPath + 'UpdateUser';
export const toggleUser = administratorRootPath + 'DisableAdminUser/';
export const deleteUser = administratorRootPath + 'RemoveAdminUser/';
export const getCompany = administratorRootPath + 'Admin_GetCompany';
export const getCountry = administratorRootPath + 'Admin_GetCountry';
export const getFunction = administratorRootPath + 'Admin_GetFunction';
export const getAllCompanyCountry = administratorRootPath + 'GetAllCompanyCountry';
export const addAdminPermission = administratorRootPath + 'AddAdminPermission';
export const updateAdminPermission = administratorRootPath + 'UpdateAdminPermission';
export const getAdminPermissionByUserId = administratorRootPath + 'GetAdminPermissionByUserId/';
export const getAdminLog = administratorRootPath + "GetAdminLog";
export const deleteAnyUser = administratorRootPath + "DeleteUser";


export const disableUser = administratorRootPath + 'DisableAdminUser';
//export const deleteUser = administratorRootPath + 'RemoveAdminUser';
export const getAllUsers = administratorRootPath + 'GetAllUsers';

export const getDepUsers = administratorRootPath + 'GetDepUser';
export const unlockUser = administratorRootPath + 'UnlockUser';

export const getUsersExpiry = administratorRootPath + 'GetUserExpiry';
export const updateUserExpiry = administratorRootPath + 'UpdateUserExpiry';

export const getUserEmailSuffix = administratorRootPath + 'GetUserEmailSuffix';
export const addUserEmailSuffix = administratorRootPath + 'AddUserEmailSuffix';
export const removeUserEmailSuffix = administratorRootPath + 'RemoveUserEmailSuffix';

export const getUserRestrictedEmailSuffix = administratorRootPath + 'GetUserRestrictedEmailSuffix';
export const addUserRestrictedEmailSuffix = administratorRootPath + 'AddUserRestrictedEmailSuffix';
export const removeUserRestrictedEmailSuffix = administratorRootPath + 'RemoveUserRestrictedEmailSuffix';

export const getAdminCountries = administratorRootPath + "GetAdminCountries";
export const getAdminPeriods = administratorRootPath + "GetAdminPeriods";
export const getAdminTherapeuticCategories = administratorRootPath + "GetAdminTherapeuticCategories";
export const getUserRights = administratorRootPath + "GetUserRights";
export const addOrUpdateUserRights = administratorRootPath + "AddOrUpdateUserRights";


export const getUserClients = administratorRootPath + "GetUserClients";
export const addUserClient = administratorRootPath + "AddUserClient";
export const waiveActivationToClient = administratorRootPath + "WaiveActivationToClient";
export const unsubscribeClient = administratorRootPath + "UnsubscribeClient";
export const lockUnlockClientAccount = administratorRootPath + "LockUnlockClientAccount";
export const removeUserClient = administratorRootPath + "RemoveUserClient";
export const activeDeactiveToClient = administratorRootPath + "ActiveDeactiveToClient";

export const getUserPreferences = administratorRootPath + "GetUserPreferences";
export const addUserPreference = administratorRootPath + "AddUserPreference";

export const dataManagerProductRootPath = rootPath + 'dataManagerProducts/';
export const deleteDMProductRecord = dataManagerProductRootPath + "DeleteDMProductRecord";

export const getUserLoginDetail = administratorRootPath + 'GetUserLoginDetail';


export const companyProfileRootPath = rootPath + 'companyProfile/';
export const getCompanyForProfileList = companyProfileRootPath + "GetCompanyForProfileList";
export const addRemoveFavoriteForCompany = companyProfileRootPath + "AddRemoveFavoriteForCompany";
export const getCountryList = companyProfileRootPath + "GetCountryList";
export const getFavoriteCompanyList = companyProfileRootPath + "GetFavoriteCompanyList";
export const GetCompanyProfileRecords = companyProfileRootPath + "GetCompanyProfileRecords";
export const GetCompanyProfileTopInfo = companyProfileRootPath + "GetCompanyProfileTopInfo";
export const GetTherapeuticCategoryWiseCompanyInfo = companyProfileRootPath + "GetTherapeuticCategoryWiseCompanyInfo";
export const GetCompanyProfileAdditionalNoteList = companyProfileRootPath + 'GetAdditionalNoteList';
export const AddUpdateCompanyProductProfileUserPreference = companyProfileRootPath + 'AddUpdateCompanyProductProfileUserPreference';
export const GetCompanyProductProfileUserPreferences = companyProfileRootPath + 'GetCompanyProductProfileUserPreferences';
export const GetCompanyUpdateInfo = companyProfileRootPath + 'GetCompanyUpdateInfo';
export const SubscribeUnSubscribeFavoriteCompany = companyProfileRootPath + 'SubscribeUnSubscribeFavoriteCompany';

export const productProfileRootPath = rootPath + 'ProductProfile/';
export const GetProductForProfileList = productProfileRootPath + "GetProductForProfileList";
export const addRemoveFavoriteForProduct = productProfileRootPath + "AddRemoveFavoriteForProduct";
export const getFavoriteProductList = productProfileRootPath + "GetFavoriteProductList";
export const GetProductProfileRecords = productProfileRootPath + "GetProductProfileRecords";
export const GetProductProfileTopInfo = productProfileRootPath + "GetProductProfileTopInfo";
export const GetTherapeuticCategoryWiseProductInfo = productProfileRootPath + "GetTherapeuticCategoryWiseProductInfo";
export const GetProductProfileAdditionalNoteList = productProfileRootPath + 'GetAdditionalNoteList';
export const SubscribeUnSubscribeFavoriteProduct = productProfileRootPath + 'SubscribeUnSubscribeFavoriteProduct';

export const regionRootPath = rootPath + 'region/';
export const getRegionList = regionRootPath + "GetRegionList";
export const GetRegionListHavingCountry = regionRootPath + "GetRegionListHavingCountry";


export const keyUpdateManagementRootPath = rootPath + 'KeyUpdates/';
export const getKeyUpdates = keyUpdateManagementRootPath + 'GetKeyUpdates';
export const AddKeyUpdates = keyUpdateManagementRootPath + 'AddUpdateKeyUpdate';
export const DeleteKeyUpdates = keyUpdateManagementRootPath + 'DeleteKeyUpdate/';
export const GetKeyUpdateTags = keyUpdateManagementRootPath + 'GetKeyUpdateTags';
export const GetKeyUpdateList = keyUpdateManagementRootPath + 'GetKeyUpdateList';
export const UpdateEventEmailConfig = keyUpdateManagementRootPath + 'UpdateEventEmailConfig';
export const GetAllEventEmailConfig = keyUpdateManagementRootPath + 'GetAllEventEmailConfig';

export const brandRootPath = rootPath + 'Brand/';
export const GetMyBrandGroups = brandRootPath + 'GetMyBrandGroups'; 
export const AddUpdateMyBrandGroup = brandRootPath + 'AddUpdateMyBrandGroup';
export const DeleteMyBrandGroup = brandRootPath + 'DeleteMyBrandGroup/';
export const GetBrandGroupFilters = brandRootPath + 'GetBrandGroupFilters';
export const GetCompanyTherapeuticBrandAssociation = brandRootPath + 'GetCompanyTherapeuticBrandAssociation';
export const GetGenericNames = brandRootPath + 'GetGenericNames';

export const salesforceRootPath = rootPath + 'Salesforce/';
export const GetSalesforceList = salesforceRootPath + 'GetSalesforceList'; 

export const analyticsRootPath = rootPath + 'Analytics/';
export const GetCompanyCountryAnalysisGridData = analyticsRootPath + 'GetCompanyCountryAnalysisGridData';
export const GetCompanyCountryAnalysisChartData = analyticsRootPath + 'GetCompanyCountryAnalysisChartData';
export const GetCompanyDeploymentByCountryPCAndSpecialtyGridData = analyticsRootPath + 'GetCompanyDeploymentByCountryPCAndSpecialtyGridData';
export const GetCompanyDeploymentByCountryPCAndSpecialtyChartData = analyticsRootPath + 'GetCompanyDeploymentByCountryPCAndSpecialtyChartData';
export const GetTotalCompanyDeploymentByCountryAndTCGridData = analyticsRootPath + 'GetTotalCompanyDeploymentByCountryAndTCGridData';
export const GetTotalCompanyDeploymentByCountryAndTCChartData = analyticsRootPath + 'GetTotalCompanyDeploymentByCountryAndTCChartData';
export const GetCompanyPortfolioByTCAndSalesForceGridData = analyticsRootPath + 'GetCompanyPortfolioByTCAndSalesForceGridData';
export const GetCompanyPortfolioByTCAndSalesForceChartData = analyticsRootPath + 'GetCompanyPortfolioByTCAndSalesForceChartData';
export const GetProductFTEsByTCAndSalesForceUsingBrandNameGridData = analyticsRootPath + 'GetProductFTEsByTCAndSalesForceUsingBrandNameGridData';
export const GetProductFTEsByTCAndSalesForceUsingBrandNameChartData = analyticsRootPath + 'GetProductFTEsByTCAndSalesForceUsingBrandNameChartData';
export const GetProductFTEsByTCAndSalesForceUsingGenericNameGridData = analyticsRootPath + 'GetProductFTEsByTCAndSalesForceUsingGenericNameGridData';
export const GetProductFTEsByTCAndSalesForceUsingGenericNameChartData = analyticsRootPath + 'GetProductFTEsByTCAndSalesForceUsingGenericNameChartData';
export const GetSalesRepresentativeCompensationBySalesForceAndProductGridData = analyticsRootPath + 'GetSalesRepresentativeCompensationBySalesForceAndProductGridData';
export const GetSalesRepresentativeCompensationBySalesForceAndProductChartData = analyticsRootPath + 'GetSalesRepresentativeCompensationBySalesForceAndProductChartData';
export const GetReachAndFrequencyBySalesForceAndProductGridData = analyticsRootPath + 'GetReachAndFrequencyBySalesForceAndProductGridData';
export const GetReachAndFrequencyBySalesForceAndProductChartData = analyticsRootPath + 'GetReachAndFrequencyBySalesForceAndProductChartData';
export const GetCustomerDropdowns = analyticsRootPath + 'GetCustomerDropdowns';
export const SaveUserAnalyticFilters = analyticsRootPath + "SaveUserAnalyticFilters";
export const GetUserAnalyticFilters = analyticsRootPath + "GetUserAnalyticFilters";
export const DeleteUserAnalyticFilter = analyticsRootPath + "DeleteUserAnalyticFilter/";
