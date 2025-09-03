// Game Settings
export const MIN_TOTAL_ROUNDS: number = 1;
export const MAX_TOTAL_ROUNDS: number = 6;

export const MIN_GUESSES_PER_ROUND: number = 2;
export const MAX_GUESSES_PER_ROUND: number = 8;

export const MAX_ONLINE_GAME_PLAYERS: number = 6;

// Animation
export const LETTER_ANIMATION_TIME_MS: number = 300;
export const TIME_BETWEEN_ROUNDS_MS: number = 3000;

// Word
export const MIN_WORD_LENGTH: number = 4;
export const MAX_WORD_LENGTH: number = 12;

export const ALLOWED_NORMAL_CHARACTERS  = [
  "a","b","c","d","e","f","g","h","i","j","k","l","m",
  "n","o","p","q","r","s","t","u","v","w","x","y","z",
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];

export const ALLOWED_SPECIAL_CHARACTERS = [
  "À","Á","Â","Ã","Ä","Å","Ç","È","É","Ê","Ë","Ì","Í","Î","Ï","Ñ","Ò","Ó","Ô","Õ","Ö","Ø","Ù","Ú","Û","Ü","Ý",
  "à","á","â","ã","ä","å","æ","ç","è","é","ê","ë","ì","í","î","ï","ñ","ò","ó","ô","õ","ö","ù","ú","û","ü","ý","ÿ",
  "Ā","ā","Ă","ă","Ą","ą","Ć","ć","Ĉ","ĉ","Ċ","ċ","Č","č","Ď","ď","Đ","đ","Ē","ē","Ĕ","ĕ","Ė","ė","Ę","ę","Ě","ě",
  "Ĝ","ĝ","Ğ","ğ","Ġ","ġ","Ģ","ģ","Ĥ","ĥ","Ħ","ħ","Ĩ","ĩ","Ī","ī","Ĭ","ĭ","Į","į","İ",
  "Ĵ","ĵ","Ķ","ķ","ĸ","Ĺ","ĺ","Ļ","ļ","Ľ","ľ","Ŀ","ŀ","Ł","ł","Ń","ń","Ņ","ņ","Ň","ň","ŉ","Ŋ","ŋ","Ō","ō","Ŏ","ŏ",
  "Ő","ő","Œ","œ","Ŕ","ŕ","Ŗ","ŗ","Ř","ř","Ś","ś","Ŝ","ŝ","Ş","ş","Š","š","Ţ",
  "Ũ","ũ","Ū","ū","Ŭ","ŭ","Ů","ů","Ű","ű","Ų","ų","Ŵ","ŵ","Ŷ","ŷ","Ÿ","Ź","ź","Ż","ż","Ž","ž"
];

export const ALLOWED_NORMAL_AND_SPECIAL_CHARACTERS = [...ALLOWED_NORMAL_CHARACTERS, ...ALLOWED_SPECIAL_CHARACTERS];