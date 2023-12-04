namespace MandarinApp.Models
{
    public class Lot
    {
        public int Id { get; set; }
        public Mandarin? mandarin { get; set; }
        public int mandarinId { get; set; }
        public DateTime lotEndDate { get; set; }
        public bool isOpen { get; set; }
    }
}
