using DeploymentAnalyzer.Application.Request;
using DeploymentAnalyzer.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeploymentAnalyzer.Application.Interfaces
{
    public interface INotesRespository
    {
        Task<IReadOnlyList<NotesModel>> GetNotesAsync(NoteListRequest request);
        Task<int> AddUpdateNotesAsync(NotesRequest entity);
        Task<int> DeleteNotesAsync(long id, int userId);
    }
}
