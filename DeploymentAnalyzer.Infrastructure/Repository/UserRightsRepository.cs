using Dapper;
using DeploymentAnalyzer.Application.Interfaces;
using DeploymentAnalyzer.Core.Entities;
using DeploymentAnalyzer.Utility.Constants;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Infrastructure.Repository
{
    public class UserRightsRepository : GenericRepository<UserRightsModel>, IUserRightsRepository
    {
        public UserRightsRepository(IConfiguration configuration) : base(configuration)
        {
        }

        public async Task<UserRightsModel> GetUserRightsByUserIdAsync(int userId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@userid", userId);
            parameters.Add("@right", false,System.Data.DbType.Boolean,System.Data.ParameterDirection.Output);

            return await GetByIdAsync(parameters, StoreProcedures.GetUserRights);
        }

        public async Task<int> UpdateUserRightsAsync(UserRightsModel entity)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", entity.UserID);
            parameters.Add("@Countries", entity.Countries);
            parameters.Add("@Companies", entity.Companies);
            parameters.Add("@TherapeuticCategories", entity.TherapeuticCategories);
            parameters.Add("@Searches", entity.Searches);
            parameters.Add("@Periods", entity.Periods);
            parameters.Add("@ReportAccess", entity.ReportAccess);
            parameters.Add("@CurrentPeriodAccess", entity.CurrentPeriodAccess);
            parameters.Add("@SaveSearchAccess", entity.SaveSearchAccess);
            parameters.Add("@ExcelDownloadRights", entity.ExcelDownloadRights);
            parameters.Add("@PDFDonloadRights", entity.PDFDownloadRights);
            parameters.Add("@PrintDataRights", entity.PrintDataRights);
            parameters.Add("@LinkedAccounts", entity.LinkedAccounts);
            parameters.Add("@DataVisualRights", entity.DataVisualRights);

            return await UpdateAsync(parameters, StoreProcedures.UpdateUserRights);
        }
    }
}
