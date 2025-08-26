import React, { useEffect } from "react";
import Label from "./Label";
import { AlertCircle, Check } from "lucide-react";

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
    autoFocus?: boolean;
    success?: boolean; // New prop for success state
    icon?: React.ReactNode; // Optional icon
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    subText, 
    centerText, 
    required = false, 
    errorMsg, 
    success = false,
    icon,
    id, 
    initialValue, 
    supportedSymbols, 
    onChange, 
    autoFocus = false, 
    ...props 
  }, ref) => {
    
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
          e.target.value = filtered;
        }
      }
      onChange?.(e);
    };

    // Determine input state styling
    const getInputStyles = () => {
      if (errorMsg) {
        return "border-red-500/50 bg-red-50/5 focus:border-red-500 focus:ring-red-500/20";
      }
      if (success) {
        return "border-green-500/50 bg-green-50/5 focus:border-green-500 focus:ring-green-500/20";
      }
      return "border-border bg-background hover:border-border/50 focus:border-primary focus:ring-primary/20";
    };

    const getIconStyles = () => {
      if (errorMsg) return "text-red-500";
      if (success) return "text-green-500";
      return "text-foreground-muted";
    };

    return (
      <div className="flex flex-col w-full space-y-2">
        {/* Label */}
        {label && (
          <Label 
            text={label} 
            required={required}
          />
        )}
        
        {/* Input Container */}
        <div className="relative group">
          {/* Icon */}
          {icon && (
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${getIconStyles()}`}>
              {icon}
            </div>
          )}
          
          {/* Input */}
          <input
            className={`
              w-full px-4 py-3 text-sm font-medium rounded-2xl border-2 transition-all duration-200
              ${centerText ? 'text-center' : ''}
              ${icon ? 'pl-10' : ''}
              ${success || errorMsg ? 'pr-10' : ''}
              ${getInputStyles()}
              placeholder:text-foreground-muted/60
              focus:outline-none focus:ring-4
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className || ''}
            `}
            type={type}
            ref={inputRef}
            onChange={handleChange}
            required={required}
            {...props}
            defaultValue={initialValue}
          />
          
          {/* Success/Error Icons */}
          {(success || errorMsg) && (
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200`}>
              {errorMsg && <AlertCircle className="w-4 h-4 text-red-500" />}
              {success && !errorMsg && <Check className="w-4 h-4 text-green-500" />}
            </div>
          )}
        </div>
        
        {/* Helper Text */}
        {(subText || errorMsg) && (
          <div className="flex items-start gap-2 text-xs">
            {errorMsg ? (
              <div className="flex items-center gap-1.5 text-red-500">
                <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            ) : (
              <span className="text-foreground-muted font-medium">
                {subText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;