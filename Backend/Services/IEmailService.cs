namespace BilimShare.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string to, string token, string confirmationLink);
    }
}
