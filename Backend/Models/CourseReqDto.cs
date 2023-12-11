using BilimShare.Data;

namespace BilimShare.Models
{
    public class CourseReqDto
    {
        public string? Subject { get; set; }
        public string? TutorId { get; set; }
        public IFormFile Photo { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; }
        public int MaxParticipantNumber { get; set; }
        public int Price { get; set; }
    }
}
