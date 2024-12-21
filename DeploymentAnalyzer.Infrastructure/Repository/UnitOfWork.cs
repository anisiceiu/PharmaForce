using DeploymentAnalyzer.Application.Interfaces;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public UnitOfWork(INewsManagementRepository newsManagementRepository, ICompanyRepository companyRepository,
            IAccountRepository accountRepository, IDataManagerRepository dataManagerRepository,
            ICitationRespository citationRespository, IDataManagerProductRepository dataManagerProductRepository,
            INotesRespository notesRespository, IMasterCodeRepository masterCodeRepository, IQCQueuesRepository qCQueuesRepository,
            IDepUserRepository depUserRepository, IUserEmailSuffixRepository userEmailSuffixRepository,
            ICountryRepository countryRepository, IPeriodRepository periodRepository,
            ITherapeuticCategoryRepository therapeuticCategoryRepository, IUserRightsRepository userRightsRepository,
            IUserRepository userRepository, IAdminRepository adminRepository, ICompanyCountryRepository companyCountryRepository,
            IAdminPermissionRepository adminPermissionRepository, IUserClientRepository userClientRepository, IUserPreferenceRepository userPreferenceRepository,
            IAdminLogRepository adminLogRepository, IUserLoginDetailRepository userlogindetails,
            IPeriodSalesforceRepository periodSalesforceRepository, IKeyUpdateManagementRepository keyUpdateManagementRepository,
            ICountryCompanyRepository countryCompanyRepository, ICompanyProfileRepository companyProfileRepository,
            IRegionRepository regionRepository,IProductProfileRepository productProfileRepository,
            IGenericNameRepository genericNameRepository,
            IMyBrandRepository myBrandRepository,
            ISalesforceRepository salesforceRepository, IBackgroundJobRepository backgroundJobRepository, IAnalyticsRepository analyticsRepository)
        {
            NewsManagement = newsManagementRepository;
            Company = companyRepository;
            Account = accountRepository;
            DataManager = dataManagerRepository;
            Citation = citationRespository;
            DataManagerProduct = dataManagerProductRepository;
            Notes = notesRespository;
            MasterCode = masterCodeRepository;
            QCQueues = qCQueuesRepository;
            User = userRepository;
            DepUser = depUserRepository;
            UserEmailSuffix = userEmailSuffixRepository;
            Country = countryRepository;
            Period = periodRepository;
            TherapeuticCategory = therapeuticCategoryRepository;
            UserRights = userRightsRepository;
            User = userRepository;
            Admin = adminRepository;
            CompanyCountry = companyCountryRepository;
            AdminPermission = adminPermissionRepository;
            UserClient = userClientRepository;
            UserPreference = userPreferenceRepository;
            AdminLog = adminLogRepository;
            UserLoginDetails = userlogindetails;
            PeriodSalesforce = periodSalesforceRepository;
            CompanyProfile = companyProfileRepository;
            ProductProfile = productProfileRepository;
            KeyUpdateManagement = keyUpdateManagementRepository;
            CountryCompany = countryCompanyRepository;
            Region = regionRepository;
            MyBrandRepository = myBrandRepository;
            GenericNameRepository = genericNameRepository;
            SalesforceRepository = salesforceRepository;
            BackgroundJobRepository = backgroundJobRepository;
            AnalyticsRepository = analyticsRepository;
        }

        public INewsManagementRepository NewsManagement { get; set; }
        public ICompanyRepository Company { get; set; }
        public IAccountRepository Account { get; set; }
        public IDataManagerRepository DataManager { get; set; }
        public IDataManagerProductRepository DataManagerProduct { get; set; }
        public ICitationRespository Citation { get; set; }
        public INotesRespository Notes { get; set; }
        public IMasterCodeRepository MasterCode { get; set; }
        public IQCQueuesRepository QCQueues { get; set; }
        public IUserRepository User { get; set; }
        public IDepUserRepository DepUser { get; set; }
        public IUserEmailSuffixRepository UserEmailSuffix { get; set; }
        public ICountryRepository Country { get; set; }
        public IPeriodRepository Period { get; set; }
        public ITherapeuticCategoryRepository TherapeuticCategory { get; set; }
        public IUserRightsRepository UserRights { get; set; }
        public IAdminRepository Admin { get; set; }
        public ICompanyCountryRepository CompanyCountry { get; set; }
        public IAdminPermissionRepository AdminPermission { get; set; }
        public IUserClientRepository UserClient { get; set; }
        public IUserPreferenceRepository UserPreference { get; set; }
        public IAdminLogRepository AdminLog { get; set; }
        public IUserLoginDetailRepository UserLoginDetails { get; set; }
        public ICountryCompanyRepository  CountryCompany { get; set; }
        public IPeriodSalesforceRepository PeriodSalesforce { get; set; }
        public ICompanyProfileRepository CompanyProfile { get; set; }
        public IProductProfileRepository ProductProfile { get; set; }
        public IKeyUpdateManagementRepository KeyUpdateManagement { get; set; }
        public IRegionRepository Region { get; set; }
        public IMyBrandRepository MyBrandRepository { get; set; }
        public IGenericNameRepository GenericNameRepository { get; set; }
        public ISalesforceRepository SalesforceRepository { get; set; }
        public IBackgroundJobRepository BackgroundJobRepository { get; set; }
        public IAnalyticsRepository AnalyticsRepository { get; set; }
    }
}
