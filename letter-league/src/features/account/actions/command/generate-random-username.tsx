const adjectives = [
    "Swift", "Brave", "Clever", "Mighty", "Silent", "Golden", "Shadow", "Frost",
    "Thunder", "Crimson", "Azure", "Ember", "Storm", "Mystic", "Rogue", "Noble",
    "Fierce", "Calm", "Wild", "Pure", "Dark", "Bright", "Ancient", "Modern",
    "Lucky", "Bold", "Quick", "Strong", "Wise", "Sharp", "Smooth", "Rough",
    "Gentle", "Harsh", "Soft", "Hard", "Light", "Heavy", "Fast", "Slow",
    "Hot", "Cold", "Warm", "Cool", "Fresh", "Stale", "New", "Old",
    "Young", "Elder", "Tall", "Short", "Wide", "Narrow", "Deep", "Shallow",
    "High", "Low", "Far", "Near", "Big", "Small", "Huge", "Tiny",
    "Grand", "Humble", "Rich", "Poor", "Free", "Bound", "Open", "Closed",
    "Clear", "Murky", "Bright", "Dim", "Loud", "Quiet", "Busy", "Idle",
    "Active", "Lazy", "Happy", "Sad", "Angry", "Peaceful", "Restless", "Calm",
    "Excited", "Bored", "Curious", "Indifferent", "Hopeful", "Desperate", "Confident", "Shy",
    "Proud", "Modest", "Generous", "Selfish", "Kind", "Cruel", "Patient", "Hasty"
];

const nouns = [
    "Wolf", "Eagle", "Tiger", "Dragon", "Phoenix", "Lion", "Bear", "Hawk",
    "Raven", "Falcon", "Panther", "Leopard", "Cheetah", "Jaguar", "Lynx", "Fox",
    "Deer", "Elk", "Moose", "Buffalo", "Horse", "Stallion", "Mare", "Colt",
    "Bull", "Ox", "Ram", "Goat", "Sheep", "Pig", "Boar", "Hog",
    "Cat", "Dog", "Hound", "Pup", "Kitten", "Puppy", "Cub", "Fawn",
    "Shark", "Whale", "Dolphin", "Seal", "Otter", "Beaver", "Mink", "Weasel",
    "Badger", "Skunk", "Raccoon", "Opossum", "Squirrel", "Chipmunk", "Mouse", "Rat",
    "Rabbit", "Hare", "Hedgehog", "Porcupine", "Armadillo", "Sloth", "Monkey", "Ape",
    "Gorilla", "Chimpanzee", "Orangutan", "Lemur", "Koala", "Kangaroo", "Wallaby", "Wombat",
    "Platypus", "Echidna", "Anteater", "Pangolin", "Aardvark", "Mole", "Shrew", "Bat",
    "Owl", "Parrot", "Crow", "Magpie", "Robin", "Sparrow", "Finch", "Canary",
    "Cardinal", "Bluejay", "Woodpecker", "Hummingbird", "Pelican", "Flamingo", "Swan", "Duck",
    "Goose", "Crane", "Heron", "Stork", "Ibis", "Egret"
];

export default function GenerateRandomUsername(): string {
    // Get random adjective and noun
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    // Generate random number between 000-999 (padded with zeros)
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${randomAdjective}${randomNoun}${randomNumber}`;
}