namespace BilimShare.Models
{
    public class TutorProfileReq
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Occupation { get; set; }
        public IFormFile Photo { get; set; }
        public string AboutMe { get; set; }
    }
}
