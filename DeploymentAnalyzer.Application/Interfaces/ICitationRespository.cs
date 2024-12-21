using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface ICitationRespository
    {
        Task<IReadOnlyList<CitationModel>> GetCitationAsync(GetCitationRequest request);
        Task<int> AddUpdateCitationAsync(CitationRequest entity);
        Task<int> DeleteCitationAsync(DeleteCitationRequest request);
        Task<IReadOnlyList<CitationModel>> GetCitationManagerAsync(GetCitationManagerRequest request);
        Task<IReadOnlyList<CitationModel>> GetCitationsForDMAsync(BaseRequest request);
        Task<IReadOnlyList<CitationSmallModel>> GetCitationsByIdCSVAsync(GetCitationByIdCSVRequest request);
    }
}
