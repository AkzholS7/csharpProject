using BilimShare.Data;
using BilimShare.Models;
using BilimShare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;
using System.Drawing;
using System.Text;

namespace BilimShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly SignInManager<BilimShareUser> _signInManager;
        private readonly UserManager<BilimShareUser> _userManager;
        private readonly BilimShareDbContext _dbContext;
        private readonly IWebHostEnvironment _appEnvironment;

        public UsersController(
            IEmailService emailService,
            IJwtService jwtService,
            UserManager<BilimShareUser> userManager,
            SignInManager<BilimShareUser> signInManager, 
            BilimShareDbContext dbContext,
            IWebHostEnvironment appEnvironment
            )
        {
            _emailService = emailService;
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _dbContext = dbContext;
            _appEnvironment = appEnvironment;
        }

        [HttpGet("GetTutorProfile/{id}")]
        public async Task<ActionResult<TutorProfile>> GetTutorProfile(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if(user == null)
            {
                return NotFound();
            }
            var tutor = new TutorProfile();
            tutor.Id = user.Id;
            tutor.Name = user.UserName;
            tutor.Occupation = user.Occupation;
            tutor.AboutMe = user.AboutMe;
            tutor.Email = user.Email;
            tutor.Rating = (int)_dbContext.Feedbacks
                .Join(_dbContext.Courses, feedback => feedback.TargetId, course => course.Id, (feedback, course) => new { feedback, course })
                .Where(x => x.course.TutorId == id)
                .GroupBy(x => x.course.TutorId)
                .Select(g => g.Average(x => x.feedback.Stars))
                .FirstOrDefault();
            if (user.AvatarPath != null)
            {
                tutor.Photo = Convert.ToBase64String(System.IO.File.ReadAllBytes(user.AvatarPath));
            }
            return tutor;
        }
        
        [HttpPut("EditTutorProfile")]
        public async Task<IActionResult> EditTutorProfile([FromForm] TutorProfileReq tutor)
        {
            var user = await _userManager.FindByIdAsync(tutor.Id);
            if (user == null)
            {
                return NotFound();
            }
            
            user.UserName = tutor.Name;
            user.Occupation = tutor.Occupation;
            user.AboutMe = tutor.AboutMe;
            if (tutor.Photo.Length > 0)
            {
                var filePath = Path.Combine(_appEnvironment.ContentRootPath, "Files/TutorsPhotos/"
                + tutor.Id +
                    "/" + tutor.Photo.FileName);
                if (!Directory.Exists(Path.Combine(_appEnvironment.ContentRootPath, "Files/TutorsPhotos/"
                    + tutor.Id)))
                {
                    Directory.CreateDirectory(Path.Combine(_appEnvironment.ContentRootPath, "Files/TutorsPhotos/"
                    + tutor.Id));
                }
                using (var stream = System.IO.File.Create(filePath))
                {
                    await tutor.Photo.CopyToAsync(stream);
                }
                user.AvatarPath = filePath;
            }
            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterDto req)
        {
            if (req == null)
            {
                return BadRequest(new { success = false, title = "Empty Inputs!" });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, title = "Modal State Invalid" });
            }
            
            var user = new BilimShareUser { UserName = req.Username, Email = req.Email, Role = req.Role };
            var result = await _userManager.CreateAsync(user, req.Password);
            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                var confirmationLink = Url.Action("ConfirmEmail", "Users", new { email = user.Email, token = token }, Request.Scheme);
                var emailResponse = await _emailService.SendEmailAsync(user.Email, token, confirmationLink);

                if (emailResponse)
                {
                    return Ok(new { success = true, title = "Check your Email and Confirm it." });
                }
                else
                {
                    return BadRequest(new { success = false , title = "Could not send email to " + req.Email + "." });
                }
            }
            return BadRequest(new { success = false, title = "Username "+ req.Username +" or Email "+req.Email+" is already taken." });
        }
        [HttpPost("LogIn")]
        [AllowAnonymous]
        public async Task<IActionResult> LogIn(LogInDto req)
        {
            if (req == null)
            {
                return Ok(new { success = false, title = "Invalid Inputs" });
            }
            if (!ModelState.IsValid)
            {
                return Ok(new { success = false, title = "Invalid Inputs" });
            }
            var user = await _userManager.FindByEmailAsync(req.Email);
            var password = await _userManager.CheckPasswordAsync(user, req.Password);

            if (password)
            {
                if (await _userManager.IsEmailConfirmedAsync(user))
                {
                    var jwt = _jwtService.CreateToken(user);
                    
                    return Ok(new
                    {
                        success = true,
                        jwt = jwt,
                        id = user.Id,
                        role = user.Role,
                        mess = "Log In Success."
                    });
                    
                }
                return BadRequest(new { title = "Your Email is not confirmed." });

            }
            return Ok(new {success = false, title = "Invalid Login or Password." });
        }

        [HttpPost("LogOut")]
        [Authorize]
        public IActionResult SignOut()
        {
            Response.Cookies.Delete("X-Access-Token");
            return Ok();
        }

        [HttpDelete("{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }
            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok("User deleted.");
            }
            return Ok(result.Errors);
        }
        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest();

            var codeDecodedBytes = WebEncoders.Base64UrlDecode(token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

            var result = await _userManager.ConfirmEmailAsync(user, codeDecoded);
            if (result.Succeeded)
            {
                var jwt = _jwtService.CreateToken(user);
                return Ok(new
                {
                    jwt,
                    mess = "Email Confirmed."
                });
                Response.Redirect("http://localhost:3000/");

            }
            return BadRequest(result.Errors);
        }
    }
}
