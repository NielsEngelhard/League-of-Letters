import { useEffect, useRef } from 'react';

interface Props {
  onKeyboardEvent: (event: KeyboardEvent) => void;
}

export default function MobileKeyboardLogger({ onKeyboardEvent }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleInput = (event: Event) => {
      const inputEvent = event as InputEvent;
      const target = event.target as HTMLInputElement;
      
      // Get the last character typed
      const lastChar = target.value.slice(-1);
      
      if (lastChar) {
        // Create a synthetic KeyboardEvent-like object
        const syntheticEvent = new KeyboardEvent('keydown', {
          key: lastChar,
          code: `Key${lastChar.toUpperCase()}`,
          keyCode: lastChar.toUpperCase().charCodeAt(0),
        });
        
        onKeyboardEvent(syntheticEvent);
      }
      
      // Clear the input to prepare for next character
      target.value = '';
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle special keys like Backspace, Enter, etc.
      if (event.key === 'Backspace' || event.key === 'Enter' || event.key === ' ') {
        onKeyboardEvent(event);
      }
    };

    // Focus the input automatically
    input.focus();
    
    // Add event listeners
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeyDown);

    // Re-focus if user taps elsewhere (to keep keyboard open)
    const handleFocusOut = () => {
      setTimeout(() => {
        if (input) input.focus();
      }, 100);
    };

    input.addEventListener('blur', handleFocusOut);

    // Cleanup
    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('blur', handleFocusOut);
    };
  }, [onKeyboardEvent]);

  return (
    <input
      ref={inputRef}
      type="text"
      style={{
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
        fontSize: '16px', // Prevents zoom on iOS
      }}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      // Prevent the input from being hidden by mobile browsers
      inputMode="text"
    />
  );
}