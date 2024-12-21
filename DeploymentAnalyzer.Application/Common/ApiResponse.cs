namespace DeploymentAnalyzer.Application.Common
{
    public class ApiResponse<T>
    {
        public bool Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Result { get; set; }
    }
}
