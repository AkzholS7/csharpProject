namespace BilimShare.Models
{
    public class FeedbackDto
    {
        public int Id { get; set; }
        public int AuthotId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorAvatar { get; set; }
        public int Stars { get; set; }
        public string Comment { get; set; }
        public int TargetId { get; set; }
    }
}
