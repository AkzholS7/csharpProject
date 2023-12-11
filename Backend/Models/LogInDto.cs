using System.ComponentModel.DataAnnotations;

namespace BilimShare.Models
{
    public class LogInDto
    {
        [Required(ErrorMessage = "An Email is required")]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage = "An Password is required")]
        public string Password { get; set; }
    }

}
