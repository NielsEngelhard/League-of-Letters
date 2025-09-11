import { useEffect } from 'react';

interface Props {
  onKeyboardEvent: (event: KeyboardEvent) => void;
}

export default function KeyboardKeyLogger({ onKeyboardEvent }: Props) {
  useEffect(() => {
    try {
      const handleKeyPress = (event: KeyboardEvent) => {
        // Call the onKeyLog function for any key press
        onKeyboardEvent(event);
      };

      // Add global event listener to document
      document.addEventListener('keydown', handleKeyPress);

      // Cleanup function to remove event listener
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };      
    } catch(err) {
      console.log("Error for KeyboardKeyLogger" + err);
    }
  }, []);

  return (
    <>
    </>
  );
}