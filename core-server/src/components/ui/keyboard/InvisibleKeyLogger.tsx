import { useEffect } from 'react';

interface Props {
  onKeyboardEvent: (event: KeyboardEvent) => void;
}

export default function InvisibleKeyLogger({ onKeyboardEvent }: Props) {
  useEffect(() => {
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
  }, []);

  return (
    <>
    </>
  );
}