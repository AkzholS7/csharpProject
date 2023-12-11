using BilimShare.Data;
using BilimShare.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BilimShare.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using System.Xml.Linq;
using System.IO;

namespace BilimShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwtService;
        private readonly SignInManager<BilimShareUser> _signInManager;
        private readonly UserManager<BilimShareUser> _userManager;
        private readonly BilimShareDbContext _dbContext;
        private readonly IWebHostEnvironment _appEnvironment;

        public CoursesController(
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

        [HttpGet("SearchCourse")]
        public async Task<ActionResult<IEnumerable<CourseResDto>>> SearchCourse(string q)
        {
            if (q == null)
            {
                GetCourse("Date",null,0,0);
            }
            if (_dbContext.Courses == null)
            {
                return NotFound();
            }
            List<Course> courses = await _dbContext.Courses.Where(x => x.Subject.Contains(q) || x.Description.Contains(q)).ToListAsync();
            List<CourseResDto> coursesDto = new List<CourseResDto>();
            foreach (Course course in courses)
            {
                CourseResDto courseDto = new CourseResDto();
                courseDto.Id = course.Id;
                courseDto.Subject = course.Subject;
                courseDto.Description = course.Description;
                courseDto.TutorId = course.TutorId;
                courseDto.MaxParticipantNumber = course.MaxParticipantNumber;
                courseDto.CurrentParticipantNumber = course.CurrentParticipantNumber;
                courseDto.Status = course.Status;
                courseDto.PublishedDate = course.PublishedDate;
                courseDto.Photo = Convert.ToBase64String(System.IO.File.ReadAllBytes(course.PhotoUrl));
                int RatingSum = _dbContext.Feedbacks.Where(r => r.TargetId == course.Id).Sum(r => r.Stars);
                int NumberOfFeedbacks = _dbContext.Feedbacks.Where(r => r.TargetId == course.Id).Count();
                if (RatingSum != 0 || NumberOfFeedbacks != 0) courseDto.LikesAmount = RatingSum / NumberOfFeedbacks;
                else courseDto.LikesAmount = 0;
                courseDto.Price = course.Price;

                var tutor = await _userManager.FindByIdAsync(course.TutorId);
                if (tutor != null)
                {
                    courseDto.TutorName = tutor.UserName;

                    coursesDto.Add(courseDto);

                }
                continue;
            }
            return coursesDto;
        }

        [HttpPost("NewCourse")]
        public async Task<IActionResult> PostCourse([FromForm] CourseReqDto req)
        {
            if (req == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            Course course = new Course();
            course.TutorId = req.TutorId;
            course.Subject = req.Subject;
            course.Description = req.Description;
            course.Status = req.Status;
            course.Price = req.Price;
            course.MaxParticipantNumber = req.MaxParticipantNumber;
            if (req.Photo.Length > 0)
            {
                var filePath = Path.Combine(_appEnvironment.ContentRootPath, "Files/CoursePhotos/"
                    + req.TutorId +
                    "/" + req.Photo.FileName);
                if (!Directory.Exists(Path.Combine(_appEnvironment.ContentRootPath, "Files/CoursePhotos/"
                    + req.TutorId)))
                {
                    Directory.CreateDirectory(Path.Combine(_appEnvironment.ContentRootPath, "Files/CoursePhotos/"
                    + req.TutorId));
                }
                using (var stream = System.IO.File.Create(filePath))
                {
                    await req.Photo.CopyToAsync(stream);
                }
                course.PhotoUrl = filePath;
            }

            _dbContext.Courses.Add(course);
            await _dbContext.SaveChangesAsync();
            return Ok(new {
                success = true,
                mess = "New Course Posting Success."
            });

        }

        [HttpPut("EditCourse/{id}")]
        public async Task<IActionResult> EditCourse([FromForm] CourseReqDto req, int id)
        {
            if (req == null)
            {
                return BadRequest();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var course = await _dbContext.Courses.FindAsync(id);
            course.TutorId = req.TutorId;
            course.Subject = req.Subject;
            course.Description = req.Description;
            course.Status = req.Status;
            course.Price = req.Price;
            course.MaxParticipantNumber = req.MaxParticipantNumber;
            if (req.Photo.Length > 0)
            {
                var filePath = Path.Combine(_appEnvironment.ContentRootPath, "Files/CoursePhotos/"
                    + req.TutorId +
                    "/" + req.Photo.FileName);
                if (!Directory.Exists(Path.Combine(_appEnvironment.ContentRootPath, "Files/CoursePhotos/"
                    + req.TutorId)))
                {
                    Directory.CreateDirectory(Path.Combine(_appEnvironment.ContentRootPath, "Files/CoursePhotos/"
                    + req.TutorId));
                }
                using (var stream = System.IO.File.Create(filePath))
                {
                    await req.Photo.CopyToAsync(stream);
                }
                course.PhotoUrl = filePath;
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new
            {
                success = true,
                mess = "Course Editing Success."
            });

        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            if (_dbContext.Courses == null)
            {
                return NotFound();
            }
            var course = await _dbContext.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            _dbContext.Courses.Remove(course);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("GetMaxMinOfPrice")]
        public async Task<ActionResult<MaxMinOfPrice>> GetMaxMinOfPrice()
        {
            var minMax = new MaxMinOfPrice();
            minMax.Min = _dbContext.Courses.Min(o => o.Price);
            minMax.Max = _dbContext.Courses.Max(o => o.Price);
            return minMax;
        }

        [HttpGet("GetCourse")]
        public async Task<ActionResult<IEnumerable<CourseResDto>>> GetCourse(string? valueSort, string? FilterByStatus, int? FilterByPriceMin, int? FilterByPriceMax )
        {
            if (_dbContext.Courses == null)
            {
                return NotFound();
            }
            List<Course> courses = new List<Course>();
            List<CourseResDto> coursesDto = new List<CourseResDto>();
            
            if (FilterByStatus == "Online")
            {
                courses = await _dbContext.Courses.Where(x => x.Status == "Online" 
                && x.Price >= FilterByPriceMin 
                && x.Price <= FilterByPriceMax)
                    .ToListAsync();
            }
            else if (FilterByStatus == "Offline")
            {
                courses = await _dbContext.Courses.Where(x => x.Status == "Offline"
                && x.Price >= FilterByPriceMin
                && x.Price <= FilterByPriceMax)
                    .ToListAsync();
            }
            else
            {
                courses = await _dbContext.Courses.ToListAsync();
            }
            if (valueSort == "Reverse-Name") { 
                courses = courses.OrderBy(o => o.Subject).ToList(); 
            }
            else if (valueSort == "Name")
            {
                courses = courses.OrderByDescending(o => o.Subject).ToList();
            }
            else if (valueSort == "Reverse-Date")
            {
                courses = courses.OrderBy(o => DateTime.Parse(o.PublishedDate)).ToList();
            }
            else if (valueSort == "Date")
            {
                courses = courses.OrderByDescending(o => DateTime.Parse(o.PublishedDate)).ToList();
            }
            else
            {
                courses = courses.OrderByDescending(o => DateTime.Parse(o.PublishedDate)).ToList();
            }

            
            

            foreach (Course course in courses)
            {
                CourseResDto courseDto = new CourseResDto();
                courseDto.Id = course.Id;
                courseDto.Subject = course.Subject;
                courseDto.Description = course.Description;
                courseDto.TutorId = course.TutorId;
                courseDto.MaxParticipantNumber= course.MaxParticipantNumber;
                courseDto.CurrentParticipantNumber = course.CurrentParticipantNumber;
                courseDto.Status = course.Status;
                courseDto.PublishedDate = course.PublishedDate;
                courseDto.Photo = Convert.ToBase64String(System.IO.File.ReadAllBytes(course.PhotoUrl));
                int RatingSum = _dbContext.Feedbacks.Where(r => r.TargetId == course.Id).Sum(r => r.Stars);
                int NumberOfFeedbacks = _dbContext.Feedbacks.Where(r => r.TargetId == course.Id).Count();
                if(RatingSum != 0 || NumberOfFeedbacks !=0) courseDto.LikesAmount = RatingSum / NumberOfFeedbacks;
                else courseDto.LikesAmount = 0;
                courseDto.Price = course.Price;

                var tutor = await _userManager.FindByIdAsync(course.TutorId);
                if(tutor != null)
                {
                    courseDto.TutorName = tutor.UserName;

                    coursesDto.Add(courseDto);
                    
                }
                continue;
            }
            return coursesDto;
        }
        [HttpGet("GetCourseForTutor/{id}")]
        public async Task<ActionResult<IEnumerable<CourseResDto>>> GetCourseForTutor(string id)
        {
            if (_dbContext.Courses == null)
            {
                return NotFound();
            }
            List<Course> courses = new List<Course>();
            List<CourseResDto> coursesDto = new List<CourseResDto>();
            courses = await _dbContext.Courses.Where(x => x.TutorId == id).ToListAsync();
            foreach (Course course in courses)
            {
                CourseResDto courseDto = new CourseResDto();
                courseDto.Id = course.Id;
                courseDto.Subject = course.Subject;
                courseDto.Description = course.Description;
                courseDto.TutorId = course.TutorId;
                courseDto.MaxParticipantNumber = course.MaxParticipantNumber;
                courseDto.CurrentParticipantNumber = course.CurrentParticipantNumber;
                courseDto.Status = course.Status;
                courseDto.PublishedDate = course.PublishedDate;
                courseDto.Photo = Convert.ToBase64String(System.IO.File.ReadAllBytes(course.PhotoUrl));

                int RatingSum = _dbContext.Feedbacks.Where(r => r.TargetId == course.Id).Sum(r => r.Stars);
                int NumberOfFeedbacks = _dbContext.Feedbacks.Where(r => r.TargetId == course.Id).Count();
                if (RatingSum != 0 || NumberOfFeedbacks != 0) courseDto.LikesAmount = RatingSum / NumberOfFeedbacks;
                else courseDto.LikesAmount = 0;


                courseDto.Price = course.Price;

                var tutor = await _userManager.FindByIdAsync(course.TutorId);
                if (tutor != null)
                {
                    courseDto.TutorName = tutor.UserName;

                    coursesDto.Add(courseDto);

                }
                continue;
            }
            return coursesDto;
        }
    }
}
