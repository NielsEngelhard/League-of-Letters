import React, { useEffect } from "react";
import Label from "./Label";
import { AlertCircle, Check, Palette } from "lucide-react";

interface ColorInputProps extends Omit<React.ComponentProps<"input">, 'type'> {
    label?: string;
    subText?: string;
    placeholder?: string;
    errorMsg?: string;
    required?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    initialValue?: string;
    autoFocus?: boolean;
    success?: boolean;
    showColorPreview?: boolean; // Show color preview circle
    showHexInput?: boolean; // Show hex input alongside color picker
    disableHexInput?: boolean; // Disable the hex input but keep it visible
}

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ 
    label, 
    subText, 
    required = false, 
    errorMsg, 
    success = false,
    showColorPreview = true,
    showHexInput = true,
    disableHexInput = false,
    initialValue, 
    onChange, 
    autoFocus = false,
    placeholder = "#000000",
    ...props 
  }, ref) => {
    
    // Create internal ref if no external ref is provided
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRef;
    
    // State for hex input if enabled
    const [hexValue, setHexValue] = React.useState(initialValue || '#000000');
    const [colorValue, setColorValue] = React.useState(initialValue || '#000000');

    // Auto-focus effect
    useEffect(() => {
      if (autoFocus && inputRef && typeof inputRef === 'object' && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus, inputRef]);

    // Sync initial value
    useEffect(() => {
      if (initialValue) {
        setHexValue(initialValue);
        setColorValue(initialValue);
      }
    }, [initialValue]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      setColorValue(newColor);
      setHexValue(newColor);
      onChange?.(e);
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHex = e.target.value;
      setHexValue(newHex);
      
      // Validate hex color
      if (/^#[0-9A-F]{6}$/i.test(newHex) || /^#[0-9A-F]{3}$/i.test(newHex)) {
        setColorValue(newHex);
        // Create a synthetic event for the color input
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: newHex,
            name: props.name || '',
            type: 'color'
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
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
        <div className="flex gap-3">
          {/* Color Picker */}
          <div className="relative group">
            <input
              type="color"
              className={`
                w-12 h-12 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${getInputStyles()}
                focus:outline-none focus:ring-4
                disabled:opacity-50 disabled:cursor-not-allowed
                [&::-webkit-color-swatch-wrapper]:rounded-lg [&::-webkit-color-swatch-wrapper]:p-1
                [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0
                [&::-moz-color-swatch]:rounded-lg [&::-moz-color-swatch]:border-0
              `}
              ref={inputRef}
              value={colorValue}
              onChange={handleColorChange}
              {...props}
            />
            
            {/* Color preview overlay for better visual feedback */}
            {showColorPreview && (
              <div 
                className="absolute inset-1 rounded-lg pointer-events-none border border-white/20"
                style={{ backgroundColor: colorValue }}
              />
            )}
          </div>

          {/* Hex Input (optional) */}
          {showHexInput && (
            <div className="relative group flex-1">
              {/* Palette Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 text-foreground-muted">
                <Palette className="w-4 h-4" />
              </div>
              
              {/* Hex Input */}
              <input
                type="text"
                className={`
                  w-full px-4 py-3 text-sm font-medium rounded-2xl border-2 transition-all duration-200
                  pl-10 ${success || errorMsg ? 'pr-10' : ''}
                  ${getInputStyles()}
                  placeholder:text-foreground-muted/60
                  focus:outline-none focus:ring-4
                  disabled:opacity-50 disabled:cursor-not-allowed
                  font-mono tracking-wider
                `}
                value={hexValue}
                onChange={handleHexChange}
                placeholder={placeholder}
                maxLength={7}
                disabled={disableHexInput}
                readOnly={disableHexInput}
              />
              
              {/* Success/Error Icons */}
              {(success || errorMsg) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200">
                  {errorMsg && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {success && !errorMsg && <Check className="w-4 h-4 text-green-500" />}
                </div>
              )}
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

ColorInput.displayName = "ColorInput";

export default ColorInput;