using System.ComponentModel.DataAnnotations;

namespace BilimShare.Models
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "An Username is required")]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required(ErrorMessage = "An Email is required")]
        [EmailAddress]
        public string Email { get; set; }
        [Required(ErrorMessage = "An Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "An Role is required")]
        [CheckRole(ErrorMessage = "Invalid Role.")]
        public string Role { get; set; }

    }

    public class CheckRole : ValidationAttribute
    {
        private List<string> roles = new List<string>()
        {
            "Admin",
            "Tutor",
            "Student"
        };
        public override bool IsValid(object? value)
        {
            string strValue = value as string;
            if (roles.Contains(strValue))
            {
                return true;
            }
            return false;
        }
    }

}
