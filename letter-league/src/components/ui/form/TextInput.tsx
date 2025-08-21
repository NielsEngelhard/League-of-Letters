import React, { useEffect } from "react";
import Label from "./Label";

interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
    subText?: string;
    placeholder?: string;
    errorMsg?: string;
    required?: boolean;
    centerText?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    supportedSymbols?: RegExp;
    initialValue?: string;
    autoFocus?: boolean; // New prop
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, subText, centerText, required = false, errorMsg, id, initialValue, supportedSymbols, onChange, autoFocus = false, ...props }, ref) => {
    
    // Create internal ref if no external ref is provided
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRef;

    // Auto-focus effect
    useEffect(() => {
      if (autoFocus && inputRef && typeof inputRef === 'object' && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus, inputRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (supportedSymbols) {
        const value = e.target.value;
        const filtered = value.split('').filter(char => supportedSymbols.test(char)).join('');
        if (filtered !== value) {
          e.target.value = filtered; // update the value before passing it on
        }
      }

      // Call external onChange if it exists
      onChange?.(e);
    };

    return (
      <div className="flex flex-col w-full gap-0.5">
        {label && <Label text={label} required={required} />}
        
        <input
          className={`
            ${centerText ? 'text-center' : ''}
            ${errorMsg ? "border-error" : "border-border"}
            border px-3 py-2 text-sm rounded-md font-monos bg-background focus:border-primary/30 outline-none`}
          type={type}
          ref={inputRef}
          onChange={handleChange}
          required={required}
          {...props}
          defaultValue={initialValue}
        />
        
        {subText && (
          <div className="text-xs text-foreground-muted">
            {subText}
          </div>
        )}
      </div>
    );
  }
);

export default TextInput;