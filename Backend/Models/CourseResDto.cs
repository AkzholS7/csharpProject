using BilimShare.Data;

namespace BilimShare.Models
{
    public class CourseResDto
    {
        public int Id { get; set; }
        public string? Subject { get; set; }
        public string? PublishedDate { get; set; }
        public string? TutorId { get; set; }
        public string? TutorName { get; set; }
        public string? Photo{ get; set; }
        public string? Description { get; set; }
        public double LikesAmount { get; set; }
        public string Status { get; set; }
        public int MaxParticipantNumber { get; set; }
        public int CurrentParticipantNumber { get; set; }
        public int Price { get; set; }
    }
}
