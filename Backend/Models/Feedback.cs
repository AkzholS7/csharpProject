namespace BilimShare.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public int AuthotId { get; set; }
        public int Stars { get; set; }
        public string Comment { get; set; }
        public int TargetId { get; set; }
    }
}
