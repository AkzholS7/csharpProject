using BilimShare.Data;
using BilimShare.Models;
using BilimShare.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BilimShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly UserManager<BilimShareUser> _userManager;
        private readonly BilimShareDbContext _dbContext;

        public FeedbackController(         
            UserManager<BilimShareUser> userManager,
            BilimShareDbContext dbContext
            )
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }
        [HttpPost("PostFeedback")]
        public async Task<IActionResult> PostFeedback(Feedback feedback)
        {
            try
            {
                _dbContext.Feedbacks.Add(feedback);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("GetFeedbacksForCourse")]
        public async Task<List<FeedbackDto>> GetFeedbacksAsync(int Id)
        {
            var list = _dbContext.Feedbacks.Where(q => q.TargetId == Id).ToList();
            List<FeedbackDto> feedbacks = new List<FeedbackDto>();
            foreach(var feedback in list)
            {
                var user = await _userManager.FindByIdAsync(feedback.AuthotId.ToString());
                if (user == null) continue;
                else
                {
                    FeedbackDto ff = new FeedbackDto();
                    ff.Id = feedback.Id;
                    ff.AuthotId = feedback.AuthotId;
                    ff.AuthorName = user.UserName;
                    if (user.AvatarPath != null)
                    {
                        ff.AuthorAvatar = Convert.ToBase64String(System.IO.File.ReadAllBytes(user.AvatarPath));
                    }
                    ff.Stars = feedback.Stars;
                    ff.Comment = feedback.Comment;
                    ff.TargetId = feedback.TargetId;
                    feedbacks.Add(ff);
                }
            }
            return feedbacks;
        } 
    }
}
