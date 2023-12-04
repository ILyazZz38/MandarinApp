namespace MandarinApp.Models
{
    public class Bet
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public Lot? lot { get; set; }
        public int lotId { get; set; }
        public string UserEmail { get; set; }
    }
}
