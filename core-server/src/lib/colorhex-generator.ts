export default function generateRandomColorHex() {
  // Generate a random integer between 0 and 255 for each color component
  const randomInt = () => Math.floor(Math.random() * 256);

  // Convert each component to a 2-digit hexadecimal string
  const red = randomInt().toString(16).padStart(2, '0');
  const green = randomInt().toString(16).padStart(2, '0');
  const blue = randomInt().toString(16).padStart(2, '0');

  // Combine the components into a single hex color string
  return `#${red}${green}${blue}`;
}