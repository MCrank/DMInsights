namespace DMInsights.Models.NonPlayerCharacters
{
    public class NonPlayerCharacter
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int HitPoints { get; set; }
        public int ArmorClass { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int MoveSpeed { get; set; }
        public int OwnerId { get; set; }
        public string CharacterRace { get; set; }
        public string CharacterType { get; set; }
        public int PassivePerception { get; set; }
        public int InitiativeModifier { get; set; }
        public int SpellSaveDC { get; set; }
        public decimal ChallengeRating { get; set; }
        public int? CampaignId { get; set; }
    }
}
