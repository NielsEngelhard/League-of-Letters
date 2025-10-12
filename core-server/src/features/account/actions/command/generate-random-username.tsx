  const colors: string[] = [
    "Rode", "Groene", "Blauwe", "Gele", "Oranje", "Paarse", "Roze",
    "Zwarte", "Witte", "Grijze", "Bruine", "Turquoise", "Lila",
    "Gouden", "Zilveren"
  ];

  const funkyNouns: string[] = [
    "Aap", "Kip", "Koe", "Schaap", "Egel", "Slak", "Pinguïn", "Olifant", "Vis", "Eekhoorn",
    "Duif", "Vogel", "Krokodil", "Panda", "Nijlpaard", "Varken", "Kangoeroe", "Kikker", "Wasbeer", "Uil",
    "Schildpad", "Papegaai", "Vlo", "Ezeltje", "Muis", "Vulkaan", "Tosti", "Sok", "Banaan", "Theepot",
    "Koekje", "Broodje", "Stoel", "Robot", "Pannekoek", "Bitterbal", "Kaasblokje", "Koffiebeker", "Pindakaas", "Poffertje"
  ];

export default function GenerateRandomUsername(isGuestAccount: boolean = false): string {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomNoun = funkyNouns[Math.floor(Math.random() * funkyNouns.length)];

  return `${randomColor} ${randomNoun}${isGuestAccount ? " (G)" : ""}`;
}