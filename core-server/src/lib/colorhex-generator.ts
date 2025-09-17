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

export function hexToRgba(hex: string, alpha: number) {
  let r = 0, g = 0, b = 0;

  // Remove # if present
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}