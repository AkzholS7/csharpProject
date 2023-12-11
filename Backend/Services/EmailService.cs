using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;

namespace BilimShare.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<bool> SendEmailAsync(string to, string token, string confirmationLink)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_config.GetSection("Email:DisplayName").Value, _config.GetSection("Email:Username").Value));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = "Email Verification";
                email.Body = new TextPart(TextFormat.Html) { Text = "<a href=" + confirmationLink + ">Confirm</a>"};

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_config.GetSection("Email:Host").Value, 587, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_config.GetSection("Email:Username").Value, _config.GetSection("Email:Password").Value);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
                return true;
            }
            catch(Exception)
            {
                return false;
            }
        }
    }
}
