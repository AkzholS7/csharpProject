using BilimShare.Data;

namespace BilimShare.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string? Subject { get; set; }
        public string? PublishedDate { get; set; } = DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss");
        public string? TutorId { get; set; }
        public string? PhotoUrl { get; set; }
        public string? Description { get; set; }
        public int LikesAmount { get; set; } = 0;
        public string? Status { get; set; }
        public int MaxParticipantNumber { get; set; } = 1;
        public int CurrentParticipantNumber { get; set; } = 0;
        public int Price { get; set; } = 0;
    }
}
